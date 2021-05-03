import axios from 'axios';

const PARAM_MAX = 0xffffffff;
const IMAGES_PER_GALLERY = 16;

const waifuKeyRegex = /^\s*g:(\d+|\?)\|c:(\d+|\?)\|p:(\d+|\?)\s*$/i;

export interface WaifuParams {
  girl: number,
  color: number,
  pose: number,
}

export interface WaifuResult {
  key: string,
  url: string,
}
export interface WaifuGalleryResult {
  key: string,
  urls: string[],
  poses: number[],
}

export async function getRandomWaifu(): Promise<WaifuResult> {
  const params = getRandomWaifuParams();
  return getWaifuByParams(params);
}

export async function getWaifuByParams({ girl, color, pose }: WaifuParams): Promise<WaifuResult> {
  const { data } = await axios.request({
    method: 'POST',
    url: 'https://api.waifulabs.com/generate_big',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      currentGirl: buildGirlSeeds({ girl, color, pose }),
      step: 4,
      size: 512,
    },
  });
  return {
    key: createWaifuKey({ girl, color, pose }),
    url: `data:image/png;base64,${data.girl}`,
  };
}

export async function getRandomPoseGallery(numPoses: number): Promise<WaifuGalleryResult> {
  const params = getRandomWaifuParams();
  return getPoseGallery(params, numPoses);
}

export async function getPoseGallery(params: WaifuParams, numPoses: number): Promise<WaifuGalleryResult> {
  const { girl, color, pose } = params;
  const numCalls = Math.ceil(numPoses / IMAGES_PER_GALLERY);
  const promises = [];
  const urls: string[] = [];
  const poses: number[] = [];
  for (let i = 0; i < numCalls; i++) {
    const request = axios.request({
      method: 'POST',
      url: 'https://api.waifulabs.com/generate',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        currentGirl: buildGirlSeeds({ girl, color, pose }),
        step: 3,
      },
    });
    promises.push(request);
    // Is this jank? I feel like this might be jank...
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    request.then(({ data }) => {
      data.newGirls.forEach(({ image, seeds }: any) => {
        const newParams = extractWaifuParams(seeds);
        poses.push(newParams.pose);
        const url = `data:image/png;base64,${image}`;
        urls.push(url);
      });
    });
  }
  await Promise.all(promises);
  return {
    key: createWaifuKey({ girl, color, pose }),
    urls,
    poses,
  };
}

export function createWaifuKey({ girl, color, pose }: WaifuParams) {
  return `g:${girl}|c:${color}|p:${pose}`;
}

export function parseWaifuKey(id: string): { valid: boolean, params: WaifuParams } {
  const defaultResult = {
    valid: false,
    params: { girl: NaN, color: NaN, pose: NaN },
  };

  const match = id?.match(waifuKeyRegex);
  if (!match) {
    return defaultResult;
  }

  const [, gPart, cPart, pPart] = match;
  const girl = gPart === '?' ? getRandomParamVal() : parseInt(gPart, 10);
  const color = cPart === '?' ? getRandomParamVal() : parseInt(cPart, 10);
  const pose = pPart === '?' ? getRandomParamVal() : parseInt(pPart, 10);

  if (!validParam(girl) || !validParam(color) || !validParam(pose)) {
    return defaultResult;
  }
  return { valid: true, params: { girl, color, pose } };
}

function getRandomParamVal(): number {
  return Math.floor(Math.random() * PARAM_MAX);
}

export function getRandomWaifuParams(): WaifuParams {
  return {
    girl: getRandomParamVal(),
    color: getRandomParamVal(),
    pose: getRandomParamVal(),
  };
}

function validParam(param: number): boolean {
  return !Number.isNaN(param) && param >= 0 && param <= PARAM_MAX;
}

function buildGirlSeeds({ girl, color, pose }: WaifuParams) {
  return [
    pose, pose, pose, pose,
    girl, girl, girl, girl, girl, girl, girl, girl,
    color, color, color, color,
    0,
    [0.0, 0.0, 0.0],
  ];
}

function extractWaifuParams(girlSeeds: any): WaifuParams {
  const pose = girlSeeds[0];
  const girl = girlSeeds[4];
  const color = girlSeeds[12];
  return { girl, color, pose };
}
