# out/queue.json 의 단어를 한국어 음성으로 만들어 public/tts/ 에 넣는다.
#
#   powershell -File scripts/make-tts.ps1
#
# 큐 파일은 건드리지 않는다. render.mjs 가 public/tts/{id}.wav 가 있는지 보고
# 알아서 붙인다. PowerShell 5.1 의 JSON 직렬화가 배열을 망가뜨려서, 쓰기는
# 전부 Node 쪽에 맡기는 편이 안전하다.
#
# Windows 내장 음성(Heami)이라 무료·오프라인이다. 더 자연스러운 소리가 필요하면
# 이 스크립트만 Azure/Google 신경망 음성으로 갈아끼우면 나머지는 그대로 돈다.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$videoDir = Split-Path -Parent $PSScriptRoot
$queuePath = Join-Path $videoDir 'out\queue.json'
$ttsDir = Join-Path $videoDir 'public\tts'

if (-not (Test-Path $queuePath)) {
  Write-Error 'out/queue.json 이 없습니다. 먼저 npm run queue 를 실행하세요.'
}

New-Item -ItemType Directory -Force -Path $ttsDir | Out-Null

# @() 로 감싸지 않으면 원소가 하나일 때 배열이 아니라 객체로 풀린다
$queue = @([System.IO.File]::ReadAllText($queuePath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json)

foreach ($q in $queue) {
  $file = "$($q.id).wav"
  $path = Join-Path $ttsDir $file

  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice('Microsoft Heami Desktop')
  # 단어 하나만 읽으므로 조금 느리게 해야 알아듣기 쉽다
  $synth.Rate = -2
  $synth.SetOutputToWaveFile($path)
  $synth.Speak($q.word)
  $synth.Dispose()

  Write-Host "  $($q.word) -> tts/$file"
}

Write-Host "`n음성 $($queue.Count)개 생성 -> public/tts/"
