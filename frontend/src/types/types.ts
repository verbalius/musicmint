export type DonationItemT = {
  amount: bigint;
  donor: string;
  timestamp: bigint;
  artistAddress: string;
};

export interface StreamT {
  id: string;
  name: string;
  vhost: string;
  app: string;
  live_ms: number;
  clients: number;
  frames: number;
  send_bytes: number;
  recv_bytes: number;
  kbps: Kbps;
  publish: Publish;
  video: null;
  audio: null;
}

export interface Kbps {
  recv_30s: number;
  send_30s: number;
}

export interface Publish {
  active: boolean;
  cid: string;
}
export type NftItemT = {
  recipient: string;
  metadataURI: string;
  artistAddress: string;
};
