const target_tauri = true;

export const api_proxy_addr = "http://127.0.0.1:8000";
export const img_proxy_addr = "http://127.0.0.1:9000";
export const dest_api = target_tauri ? api_proxy_addr : "";
export const dest_img = target_tauri ? img_proxy_addr : "img-proxy";
export const dest_root: string = target_tauri ? "" : "/fablab-react";
