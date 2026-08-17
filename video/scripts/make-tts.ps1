# Generates Korean pronunciation audio for out/queue.json into public/tts/.
#
#   powershell -File scripts/make-tts.ps1
#
# This file is deliberately ASCII-only. Windows PowerShell 5.1 reads .ps1 files as
# ANSI unless they carry a UTF-8 BOM, and a BOM does not survive every editor, so
# Korean comments here would eventually break the parser. Korean text belongs in
# the data files, not in this script.
#
# It does not touch queue.json. render.mjs looks for public/tts/{id}.wav and
# {id}-q.wav and attaches whatever it finds. PowerShell 5.1 mangles arrays on JSON
# round-trip, so all JSON writing stays on the Node side.
#
# Uses the built-in Windows voice (Heami): free and offline. To move to a neural
# voice later, replace only this script - nothing else depends on how the wav is made.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$videoDir = Split-Path -Parent $PSScriptRoot
$queuePath = Join-Path $videoDir 'out\queue.json'
$ttsDir = Join-Path $videoDir 'public\tts'

if (-not (Test-Path $queuePath)) {
  Write-Error 'out/queue.json not found. Run `npm run queue` first.'
}

New-Item -ItemType Directory -Force -Path $ttsDir | Out-Null

# ConvertFrom-Json emits the whole array as ONE pipeline item in PS 5.1, so wrapping
# it in @() would nest it and the loop below would run exactly once. Assign directly.
$queue = [System.IO.File]::ReadAllText($queuePath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json

function Write-Speech([string]$text, [string]$path, [int]$rate) {
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice('Microsoft Heami Desktop')
  $synth.Rate = $rate
  $synth.SetOutputToWaveFile($path)
  $synth.Speak($text)
  $synth.Dispose()
}

$made = 0
foreach ($q in $queue) {
  # Rate must be parenthesised. A bare -2 is parsed as a parameter name.
  # A lone word needs a slower rate to stay intelligible.
  Write-Speech $q.word (Join-Path $ttsDir "$($q.id).wav") (-2)
  Write-Host "  $($q.id).wav"
  $made++

  # Korean-question format also gets the question sentence read aloud.
  if ($q.PSObject.Properties.Name -contains 'question') {
    Write-Speech $q.question (Join-Path $ttsDir "$($q.id)-q.wav") (0)
    Write-Host "  $($q.id)-q.wav"
    $made++
  }
}

Write-Host ""
Write-Host "$made wav file(s) written to public/tts/"
