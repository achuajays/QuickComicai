export enum AppState {
  FORM = 'FORM',
  GENERATING = 'GENERATING',
  VIEWING = 'VIEWING',
}

export interface StoryInputs {
  character: string;
  setting: string;
  problem: string;
  solution: string;
  ending: string;
  panelCount: number;
}

export interface ComicScene {
  scene: string;
  dialogue: string;
  imagePrompt: string;
}

export interface GeneratedImage {
  id: string;
  base64: string;
}
