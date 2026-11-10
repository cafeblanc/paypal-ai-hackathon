$sp = New-Object -ComObject SAPI.SpVoice
$voices = $sp.GetVoices()
for ($i = 0; $i -lt $voices.Count; $i++) {
    $v = $voices.Item($i)
    Write-Output "[$i] $($v.GetDescription())"
}
