const LEAD_INTENT_PATTERN =
  /報價|估價|正式報價|預約(?:諮詢|評估|討論)?|合作(?:方案|提案)?|可以幫我(?:們)?做|能幫我(?:們)?做|幫我(?:們)?建置|想請你們做|想找你們做|準備導入|申請試用|想試用|book (?:a )?(?:demo|consultation)|request (?:a )?quote|talk to sales|work with (?:you|line101chat)/iu;

export function detectLeadIntent(message: string) {
  return LEAD_INTENT_PATTERN.test(message);
}
