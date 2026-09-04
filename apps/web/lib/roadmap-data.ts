// Roadmap and innercircle video data — extracted from (portal)/portal/roadmap/page.tsx
// so the public-facing innercircle pitch deck can import it without crossing a
// route-group boundary (Next.js forbids relative imports that traverse a route
// group like `(portal)` from a sibling `(frontend)` page).

export type Video = { id?: string; hash?: string; label: string; href?: string };

export const CNC: Video[] = [
  { id: "1201290210", hash: "9363f5a5de", label: "6/14/26" },
  { id: "1197879523", hash: "b311ea99d1", label: "5/31/26" },
  { id: "1193112745", hash: "3863d9f697", label: "5/17/26" },
  { id: "1175798431", hash: "35eaed7df2", label: "3/15/26" },
  { id: "1173868687", hash: "98ec2906f4", label: "3/1/26" },
  { id: "1155829854", hash: "ff02517ce5", label: "1/18/26" },
  { id: "1148543829", label: "12/21/25" },
  { id: "1146446717", hash: "62f2b40525", label: "12/14/25" },
  { id: "1135200815", label: "11/9/25" },
  { id: "1133013682", label: "11/2/25" },
  { id: "1128727713", hash: "fbf97c074f", label: "10/19/25" },
  { id: "1114762699", hash: "a850701f27", label: "8/31/25" },
];

export const CUECASTS: Video[] = [
  { id: "1203318818", hash: "b8aac0cc6e", label: "6/21/26" },
  { id: "1195220470", hash: "274d018a3f", label: "5/24/26" },
  { id: "1191014940", hash: "a1cddec6bf", label: "5/10/26" },
  { id: "1188924684", hash: "139016c27f", label: "5/3/26" },
  { id: "1184668500", hash: "cb68200777", label: "4/19/26" },
  { id: "1177156977", hash: "9e81602352", label: "3/25/26" },
  { id: "1177156977", hash: "9e81602352", label: "3/25/26" },
  { id: "1176203834", label: "3/23/26" },
  { id: "1163147705", hash: "765d97af81", label: "2/9/26" },
  { id: "1158257286", hash: "1e3fd6a142", label: "1/25/26" },
  { id: "1153452357", hash: "77525bb14c", label: "1/11/26" },
  { id: "1149962357", hash: "e1e8134fdf", label: "12/28/25" },
  { id: "1147535291", hash: "2d0e20e65f", label: "12/17/25" },
  { id: "1144396697", hash: "ad268fe005", label: "12/7/25" },
  { id: "1137540915", hash: "443c707268", label: "11/16/25" },
  { id: "1130752380", hash: "1dc6370c93", label: "10/26/25" },
  { id: "1126709097", hash: "f28e7bd37f", label: "10/12/25" },
  { id: "1124703573", hash: "9638d6e4c4", label: "10/5/25" },
  { id: "1122730757", hash: "555709566d", label: "9/28/25" },
  { id: "1120700415", label: "9/21/25" },
  { id: "1118628945", hash: "d79595cfac", label: "9/14/25" },
  { id: "1068805247", label: "3/24/25" },
];
