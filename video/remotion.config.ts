import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
// 쇼츠는 세로 영상이라 업로드 전 재인코딩을 피하려면 H.264 + yuv420p 가 안전하다
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
