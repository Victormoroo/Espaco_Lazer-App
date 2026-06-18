<#
  Libera o Expo/Metro no Firewall do Windows para testar no celular via LAN
  (npm start / npx expo start), sem precisar de túnel.

  O que faz:
    1. Marca a Wi-Fi como rede Privada (confiável).
    2. Remove as regras que BLOQUEIAM a entrada do Node.js.
    3. Cria uma regra liberando as portas do Expo/Metro na entrada (só em
       redes Privadas/Domínio — não expõe nada em redes públicas).

  Como rodar (a partir da pasta do projeto):
    powershell -ExecutionPolicy Bypass -File .\scripts\allow-expo-firewall.ps1

  O script pede elevação (UAC) sozinho. É seguro rodar mais de uma vez.
#>

# --- Auto-elevação (UAC) ---
$isAdmin = ([Security.Principal.WindowsPrincipal] `
  [Security.Principal.WindowsIdentity]::GetCurrent()
).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
  Write-Host "Solicitando privilegios de administrador (aceite o UAC)..." -ForegroundColor Yellow
  Start-Process powershell.exe -Verb RunAs `
    -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
  return
}

Write-Host "==> Aplicando liberacao do Expo/Metro no firewall..." -ForegroundColor Cyan

# 1. Wi-Fi como rede Privada
try {
  Set-NetConnectionProfile -InterfaceAlias 'Wi-Fi' -NetworkCategory Private -ErrorAction Stop
  Write-Host "[ok] Wi-Fi marcada como Privada." -ForegroundColor Green
} catch {
  Write-Host "[aviso] Nao foi possivel mudar a Wi-Fi para Privada: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 2. Remover regras de bloqueio do Node
$blocked = Get-NetFirewallApplicationFilter |
  Where-Object { $_.Program -like '*node*' } |
  Get-NetFirewallRule -ErrorAction SilentlyContinue |
  Where-Object { $_.Direction -eq 'Inbound' -and $_.Action -eq 'Block' }

if ($blocked) {
  $blocked | Remove-NetFirewallRule
  Write-Host "[ok] Removidas $($blocked.Count) regra(s) que bloqueavam o Node." -ForegroundColor Green
} else {
  Write-Host "[ok] Nenhuma regra de bloqueio do Node encontrada." -ForegroundColor Green
}

# 3. Liberar portas do Expo/Metro (entrada) em redes Privadas/Dominio
$ruleName = 'Expo Metro (dev)'
Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue | Remove-NetFirewallRule
New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow `
  -Protocol TCP -LocalPort 8081,8082,8083,19000,19001,19006 -Profile Private,Domain | Out-Null
Write-Host "[ok] Portas 8081-8083/19000-19006 liberadas (entrada, redes privadas)." -ForegroundColor Green

# --- Verificacao ---
Write-Host "`n==> Estado final:" -ForegroundColor Cyan
Get-NetConnectionProfile -InterfaceAlias 'Wi-Fi' | Select-Object InterfaceAlias, NetworkCategory | Format-Table -AutoSize
Write-Host "Pronto! Agora rode 'npx expo start -c' e leia o QR no Expo Go (celular na MESMA Wi-Fi)." -ForegroundColor Green

Read-Host "`nPressione Enter para fechar"
