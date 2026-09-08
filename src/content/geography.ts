export type Language = "en" | "zh" | "de";
export type Country = "DE" | "CN";
export type City = keyof typeof cities;

export const cities = {
  munich: { en: "Munich", zh: "慕尼黑", de: "München" },
  frankfurt: { en: "Frankfurt", zh: "法兰克福", de: "Frankfurt" },
  berlin: { en: "Berlin", zh: "柏林", de: "Berlin" },
  hamburg: { en: "Hamburg", zh: "汉堡", de: "Hamburg" },
  dusseldorf: { en: "Düsseldorf", zh: "杜塞尔多夫", de: "Düsseldorf" },
  cologne: { en: "Cologne", zh: "科隆", de: "Köln" },
  shanghai: { en: "Shanghai", zh: "上海", de: "Shanghai" },
  beijing: { en: "Beijing", zh: "北京", de: "Peking" },
  guangzhou: { en: "Guangzhou", zh: "广州", de: "Guangzhou" },
  chengdu: { en: "Chengdu", zh: "成都", de: "Chengdu" },
  shenzhen: { en: "Shenzhen", zh: "深圳", de: "Shenzhen" },
  hangzhou: { en: "Hangzhou", zh: "杭州", de: "Hangzhou" },
};
export const countryCities: Record<Country, City[]> = {
  DE: ["munich", "frankfurt", "berlin", "hamburg", "dusseldorf", "cologne"],
  CN: ["shanghai", "beijing", "guangzhou", "chengdu", "shenzhen", "hangzhou"],
};
