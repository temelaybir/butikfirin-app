2025-07-20T20:24:12.816Z [info] 🔧 İyzico config oluşturuluyor: {
  testMode: false,
  baseUrl: 'https://api.iyzipay.com',
  hasApiKey: true,
  hasSecretKey: true
}
2025-07-20T20:24:12.818Z [info] 🚀 İyzico 3D Secure payment başlatılıyor: {
  orderNumber: 'SIP-1753043052081',
  amount: 159,
  currency: 'TRY',
  conversationId: 'conv_1753043052817_6tlo8phvw'
}
2025-07-20T20:24:12.819Z [info] 🔍 Admin Supabase client oluşturuluyor... { hasUrl: true, hasServiceRole: true, hasAnonKey: true, urlLength: 40 }
2025-07-20T20:24:12.819Z [info] ✅ Admin Supabase client oluşturuluyor with service-role key
2025-07-20T20:24:12.819Z [info] ✅ Admin Supabase client başarıyla oluşturuldu
2025-07-20T20:24:13.135Z [info] 🔍 Debug event kaydedildi [info]: api_call
2025-07-20T20:24:13.136Z [info] 💰 Basket price calculation: {
  basketTotal: '159.00',
  totalAmount: '159.00',
  difference: '0.00',
  itemsCount: 1
}
2025-07-20T20:24:13.136Z [info] 📤 İyzico 3D Secure request: {
  conversationId: 'conv_1753043052817_6tlo8phvw',
  price: '159.00',
  currency: 'TRY',
  basketId: 'basket_SIP-1753043052081',
  buyerId: 'guest_1753043053134',
  basketItemsCount: 1,
  enabledInstallments: undefined,
  hasCallbackUrl: true
}
2025-07-20T20:24:13.136Z [info] 📋 İyzico full request (sanitized): {
  "locale": "tr",
  "conversationId": "conv_1753043052817_6tlo8phvw",
  "price": "159.00",
  "paidPrice": "159.00",
  "currency": "TRY",
  "basketId": "basket_SIP-1753043052081",
  "paymentGroup": "PRODUCT",
  "paymentChannel": "WEB",
  "callbackUrl": "https://www.ardahanticaret.com/api/payment/iyzico/callback",
  "installment": 1,
  "buyer": {
    "id": "guest_1753043053134",
    "name": "HALİL",
    "surname": "GÜREL",
    "gsmNumber": "05423877894",
    "email": "halilg@gmail.com",
    "identityNumber": "11111111111",
    "lastLoginDate": "2025-07-20 20:24:13",
    "registrationDate": "2025-07-20 20:24:13",
    "registrationAddress": "ARMA DİŞ LABORATUVARI - Kısıklı Cad. Ak İş Merkezi, No:2 Kat:-1, 34662 Üsküdar/İstanbul",
    "ip": "88.249.67.35",
    "city": "İstanbul",
    "country": "Turkey",
    "zipCode": "34160"
  },
  "shippingAddress": {
    "contactName": "HALİL GÜREL",
    "city": "İstanbul",
    "country": "Turkey",
    "address": "ARMA DİŞ LABORATUVARI - Kısıklı Cad. Ak İş Merkezi, No:2 Kat:-1, 34662 Üsküdar/İstanbul",
    "zipCode": "34160"
  },
  "billingAddress": {
    "contactName": "HALİL GÜREL",
    "city": "İstanbul",
    "country": "Turkey",
    "address": "ARMA DİŞ LABORATUVARI - Kısıklı Cad. Ak İş Merkezi, No:2 Kat:-1, 34662 Üsküdar/İstanbul",
    "zipCode": "34160"
  },
  "basketItems": [
    {
      "id": "16",
      "name": "Usb Şarjlı Telefon Tutucu Çakmak",
      "category1": "Elektronik",
      "category2": "",
      "itemType": "PHYSICAL",
      "price": "159.00"
    }
  ],
  "paymentCard": {
    "cardHolderName": "HALİL İBRAHİM GÜREL",
    "cardNumber": "****-****-****-0101",
    "expireMonth": "06",
    "expireYear": "2030",
    "cvc": "***",
    "registerCard": 0
  }
}
2025-07-20T20:24:13.138Z [info] 🔐 İyzico V2 auth oluşturuldu: {
  apiKey: 'G5PVbgN9...',
  randomStringLength: 32,
  uri: '/payment/3dsecure/initialize',
  headerName: 'IYZWSv2'
}
2025-07-20T20:24:13.139Z [info] 📤 İyzico request headers: {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: 'IYZWSv2 YXBpS2V5Okc1UFZiZ045RHdrNnA5RkNtczdIamdsWV...',
  url: '/payment/3dsecure/initialize',
  method: 'post'
}
2025-07-20T20:24:14.591Z [info] 📊 İyzico 3D Secure response: {
  status: 200,
  data: {
    status: 'success',
    locale: 'tr',
    systemTime: 1753043054526,
    conversationId: 'conv_1753043052817_6tlo8phvw',
    threeDSHtmlContent: 'PGh0bWw+IAogPGhlYWQ+IDwhLS0gdHJveVN0YXJ0U3VjY2Vzcy5odG0gLS0+IAogIDx0aXRsZT5HTzwvdGl0bGU+IAogIDxtZXRhIGh0dHAtZXF1aXY9IkNvbnRlbnQtTGFuZ3VhZ2UiIGNvbnRlbnQ9InRyIj4gCiAgPG1ldGEgaHR0cC1lcXVpdj0iQ29udGVudC1UeXBlIiBjb250ZW50PSJ0ZXh0L2h0bWw7IGNoYXJzZXQ9VVRGLTgiPiAKICA8bWV0YSBuYW1lPSJBdXRob3IiIGNvbnRlbnQ9IlV5Z3VsYW1hIEdlbGlzdGlybWUgQXNzZWNvIFNFRSB0YXJhZmluZGFuIHlhcGlsbWlzdGlyIj4gCiAgPHNjcmlwdCB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiIGxhbmd1YWdlPSJqYXZhc2NyaXB0IiBub25jZT0ibkVHMTRNRWZRZXRJL0dKNzdCcXBqWVJnOHBibGNTNkJvM3VROHpZb0lhZz0iPg0KCXdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHsNCgkJZG9jdW1lbnQucmV0dXJuZm9ybS5zdWJtaXQoKTsNCgl9DQo8L3NjcmlwdD4gCiA8L2hlYWQ+IAogPGJvZHk+IAogIDxmb3JtIG5hbWU9InJldHVybmZvcm0iIGFjdGlvbj0iaHR0cHM6Ly9nb2d1dmVubGlvZGVtZS5ia20uY29tLnRyL3Ryb3kvYXBwcm92ZSIgbWV0aG9kPSJwb3N0Ij4gCiAgIDxpbnB1dCB0eXBlPSJoaWRkZW4iIG5hbWU9ImdvcmVxIiB2YWx1ZT0iZXlKMlpYSnphVzl1SWpvaU1DNHdNeUlzSW1WNGNHbHllU0k2SWpNd01EWWlMQ0puYjFOMFlXMXdJam9pWlhsS2FHSkhZMmxQYVVwSlZYcFZlRTFwU2prdVpYbEtlbVJYU1dsUGFVbDNUVVJCZDAxRVFUSk9WRmt5VFVSbk1rMVVhMmxNUTBvd1lWY3hiR0l6VmpCVk1sWnFZakkxYTJONVNUWk9SRTE1VFVSQmQwMUVRWE5KYmtwMllrZFdla2xxYjJsSmFYZHBXbGhvZDBscWIzaE9lbXN5VFdwUmVrMUVWVEJtVVM1SFdVRmtVVkZIUW10aFRuVjFSSEZNYW5KQ1ZHZGpYMnRpWlVnNFYwSlRXVXRWVUdvM2JWWjVRMEZaWXpsRU5TMUlRV2xWUlZCR2VYTTVlSFJIYjFORVZVTklZalkzVnkxZlZGWnpUbFI2TmtkT2JVRkRVU0lzSW5ScGJXVWlPaUl5TURJMU1EY3lNREl6TWpReE5DSXNJbTFoWXlJNklrSTNWaXREWW10WFdITjBlRlF3VkU1TmVFUjVNMDV0V0ZvcmN5OVVXbTV6V1hoaWNIWlNjbFp2Y3pSTE5FaHVLMHBLVGxORWFtaHRhVWhhYTBabFVDdHZTM0oyTkdaMWQycHNhbHBuUTFWUFpXczRVemgyVkdOUWNFRXpVM2xaYTA1QlNXdEhhRXh0Ym01M1IwNWFRMGxMYTJObGVEZDJNV2xaZWpSbFkyOUlWVUpPVDBSRmEwMTJURVpXZFROd05sSjNZMG8zVkdneUwwaDBkek41VHl0eVYwVmFTVmczTUVOdFdFSmpRbmgwZFd4WmFtSkdUekJtVnpKT05XaFRlR05NTjNkbk5FeHFiRmxPUWxwR04yaFdTbWRKVEVkQmRWSnJNak0xVm5kM01FTmtiRVpwYkd4U05VSnJWRFpRTm5OdFVEWlBUR1ZpYTBwNE9ESmtUMnRxVEU1UlRuY3phR3hoVkZOR1ZXOWpWV1EyYzNwaFkwdFdNelV2WlVkMWFrVnVSRFE0SzNwT2FHcEtOVXN3UkU4eVUxUkdSVzh6WlhCM2EwTkZMMWhpTVZCcFZYbEhaSEpTTVZGTllYbzJNRTFKVjBGMFoxeDFNREF6WkZ4MU1EQXpaQ0lzSW0xbGNtTm9ZVzUwUkdGMFlTSTZJalV5TURNd016b3lSRGRHTTBGR09VUXdSVUl4UmpNek1EWXlOalV4T0RBM01qTTBNVEkyUVRaRk9VRkVPVUUzUlRaR1FrSXdSVEl3TlRneE5EbERPVFkwTlRNME5UWTNPak00TkRFNkl5TTNNREEyTlRZMk1EZzJNVGtpTENKcFpDSTZJakF3TmpReE1qQXdNbUV6WmkwM056Vm1MVFF5TjJNdE9ETTVaQzB3TkdKbE5XTmtNV015Tm1VaWZRPT0iPiAKICAgPG5vc2NyaXB0PiAKICAgIDxjZW50ZXI+CiAgICAgRGV2YW0gZXRtZWsgaWNpbiB0aWtsYXlpbml6LgogICAgIDxicj4KICAgICA8YnI+IAogICAgIDxpbnB1dCB0eXBlPSJzdWJtaXQiIG5hbWU9InN1Ym1pdCIgdmFsdWU9IlN1Ym1pdCIgaWQ9ImJ0blNibXQiPgogICAgPC9jZW50ZXI+IAogICA8L25vc2NyaXB0PiAKICA8L2Zvcm0+ICAKIDwvYm9keT4KPC9odG1sPg==',
    paymentId: '3657191304',
    signature: 'a09df5d00e5a8fdd0cebda0826434b725257e59a97bc53df0492f0a505b08c4d'
  },
  duration: '1773ms'
}
2025-07-20T20:24:14.913Z [info] ✅ Transaction log kaydedildi: conv_1753043052817_6tlo8phvw
2025-07-20T20:24:15.236Z [info] ✅ 3DS session kaydedildi [initialized]: conv_1753043052817_6tlo8phvw
2025-07-20T20:24:15.236Z [info] ✅ 3D Secure başarıyla başlatıldı: conv_1753043052817_6tlo8phvw
--
2025-07-20T20:24:25.768Z [info] 🔧 İyzico config oluşturuluyor: {
  testMode: false,
  baseUrl: 'https://api.iyzipay.com',
  hasApiKey: true,
  hasSecretKey: true
}
2025-07-20T20:24:25.770Z [info] 🔄 İyzico Callback Received: {
  method: 'POST',
  url: 'https://www.ardahanticaret.com/api/payment/iyzico/callback',
  conversationId: 'conv_1753043052817_6tlo8phvw',
  status: 'success',
  mdStatus: '1',
  token: 'undefined...',
  allFormFields: [
    'status',
    'paymentId',
    'conversationData',
    'conversationId',
    'mdStatus',
    'signature'
  ],
  timestamp: '2025-07-20T20:24:25.769Z'
}
2025-07-20T20:24:25.770Z [info] 📋 İyzico Callback Full Form Data: {
  status: 'success',
  paymentId: '3657191304',
  conversationData: '',
  conversationId: 'conv_1753043052817_6tlo8phvw',
  mdStatus: '1',
  signature: '24e654a6b4435b4a1c91e52d467a9e15da6fed1013bb226607c9dc8734f8a23f'
}
2025-07-20T20:24:25.771Z [info] 📨 İyzico Callback Headers: {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'tr',
  'cache-control': 'max-age=0',
  connection: 'close',
  'content-length': '183',
  'content-type': 'application/x-www-form-urlencoded',
  forwarded: 'for=31.223.127.94;host=www.ardahanticaret.com;proto=https;sig=0QmVhcmVyIDU3MjhjYzMwMmViODVkNDc5OTZlYzBhMWNiYTUyYzVlNWJiZDcwMzI5MTA1YThkYzdmYjc1NDM3NDcwMTEzNTM=;exp=1753043365',
  host: 'www.ardahanticaret.com',
  origin: 'https://api.iyzipay.com',
  priority: 'u=0, i',
  referer: 'https://api.iyzipay.com/',
  'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'cross-site',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  'x-forwarded-for': '31.223.127.94',
  'x-forwarded-host': 'www.ardahanticaret.com',
  'x-forwarded-port': '443',
  'x-forwarded-proto': 'https',
  'x-matched-path': '/api/payment/iyzico/callback',
  'x-real-ip': '31.223.127.94',
  'x-vercel-deployment-url': 'ardahanticaret-mxsrnbi0w-rdhns-projects.vercel.app',
  'x-vercel-forwarded-for': '31.223.127.94',
  'x-vercel-id': 'fra1::dwshn-1753043065354-5e3b6a5b9794',
  'x-vercel-internal-bot-check': 'skip',
  'x-vercel-internal-ingress-bucket': 'bucket017',
  'x-vercel-ip-as-number': '12735',
  'x-vercel-ip-city': 'Istanbul',
  'x-vercel-ip-continent': 'AS',
  'x-vercel-ip-country': 'TR',
  'x-vercel-ip-country-region': '34',
  'x-vercel-ip-latitude': '41.0329',
  'x-vercel-ip-longitude': '28.9529',
  'x-vercel-ip-postal-code': '34080',
  'x-vercel-ip-timezone': 'Europe/Istanbul',
  'x-vercel-ja4-digest': 't13d1517h2_8daaf6152771_b6f405a00624',
  'x-vercel-oidc-token': 'eyJraWQiOiJtcmstNDMwMmVjMWI2NzBmNDhhOThhZDYxZGFkZTRhMjNiZTciLCJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NTMwNDA1NTYsIm93bmVyX2lkIjoidGVhbV9ZVFhlTE51aDhBUWtTdExCN3gzeTg2UWgiLCJpYXQiOjE3NTMwNDA1NTYsInZlcmNlbF9pZCI6ImZyYTE6OjdkdjZ4LTE3NTMwNDA1NTYyMzMtZGRiMmFiZDdkM2RiIiwiYXVkIjoiaHR0cHM6XC9cL3ZlcmNlbC5jb21cL3JkaG5zLXByb2plY3RzIiwib3duZXIiOiJyZGhucy1wcm9qZWN0cyIsImlzcyI6Imh0dHBzOlwvXC9vaWRjLnZlcmNlbC5jb21cL3JkaG5zLXByb2plY3RzIiwicHJvamVjdF9pZCI6InByal9kZ2NnanVyT0NiaWhPUW04V3FVVkNOalN0YjFyIiwiZXhwIjoxNzUzMDQ0MTU2LCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJzY29wZSI6Im93bmVyOnJkaG5zLXByb2plY3RzOnByb2plY3Q6YXJkYWhhbnRpY2FyZXQ6ZW52aXJvbm1lbnQ6cHJvZHVjdGlvbiIsInN1YiI6Im93bmVyOnJkaG5zLXByb2plY3RzOnByb2plY3Q6YXJkYWhhbnRpY2FyZXQ6ZW52aXJvbm1lbnQ6cHJvZHVjdGlvbiIsInByb2plY3QiOiJhcmRhaGFudGljYXJldCJ9.WgQSC6t7NTWv73Uj4_KXdqt2CW3XH72N4nqLfkhH-sDhg_XRLnRBbdREeHsKLSOGPgZz7TVtoct5HejdMjrw2Djp4Yiy4m3SXI0VBt5P06jZtUQodXNG8CcFcQ3cONslSIdVWFxz8D6g2xqnh_X7nLSZVm9AjmAVbAvN59ocGmD3RXlHc775_fi936Dg-wlvezLl4etwP4bOodakY4Ih4rdNIIHdDuQFtkFAp6adV2m6EjPpwxoTg7h8Fxig_rRrg4-OW8yJTDN6KS9VBOB_z8Jw6r7IxMcWdW5LcxPi-B85vb8vB5TkqGDYJ4YYKMO3EeepMNbWxcQ2UZJkPFoN8g',
  'x-vercel-proxied-for': '31.223.127.94',
  'x-vercel-proxy-signature': 'Bearer 5728cc302eb85d47996ec0a1cba52c5e5bbd70329105a8dc7fb7543747011353',
  'x-vercel-proxy-signature-ts': '1753043365',
  'x-vercel-sc-basepath': '',
  'x-vercel-sc-headers': '{"x-vercel-function-platform":"vercel\\/proxy+serverless","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50SWQiOiJkcGxfRE5WUWo1aHZQaDdZN21kVTZHWjZTalJheVNjZiIsInVubGltaXRlZCI6ZmFsc2UsInBsYW4iOiJob2JieSIsImlzcyI6InNlcnZlcmxlc3MiLCJkb21haW4iOiJ3d3cuYXJkYWhhbnRpY2FyZXQuY29tIiwiYmxvY2siOmZhbHNlLCJpYXQiOjE3NTMwNDMwNjUsInByb2plY3RJZCI6InByal9kZ2NnanVyT0NiaWhPUW04V3FVVkNOalN0YjFyIiwiZXhwIjoxNzUzMDQzOTg1LCJvd25lcklkIjoidGVhbV9ZVFhlTE51aDhBUWtTdExCN3gzeTg2UWgiLCJyZXF1ZXN0SWQiOiJkd3Nobi0xNzUzMDQzMDY1MzU0LTVlM2I2YTViOTc5NCIsImVudiI6InByb2R1Y3Rpb24ifQ.aRr_2dPiYyOthOQg2QaFnvSVzXMiRS07yo-tAe06CMQ"}',
  'x-vercel-sc-host': 'iad1.suspense-cache-blue.vercel-infra.com'
}
2025-07-20T20:24:25.771Z [info] 🔍 Kritik Parameter Kontrolü: {
  tokenExists: false,
  tokenLength: 0,
  conversationIdExists: true,
  conversationIdValue: 'conv_1753043052817_6tlo8phvw',
  statusValue: 'success',
  mdStatusValue: '1',
  allParamKeys: [
    'status',
    'paymentId',
    'conversationData',
    'conversationId',
    'mdStatus',
    'signature'
  ],
  totalParamCount: 6
}
2025-07-20T20:24:26.232Z [info] ✅ Transaction log kaydedildi: conv_1753043052817_6tlo8phvw
2025-07-20T20:24:26.232Z [info] ✅ Callback logged: conv_1753043052817_6tlo8phvw
2025-07-20T20:24:26.232Z [info] 🚨 Callback Validation Check: {
  hasToken: false,
  hasConversationId: true,
  receivedParams: [
    'status',
    'paymentId',
    'conversationData',
    'conversationId',
    'mdStatus',
    'signature'
  ],
  formDataCount: 6
}
2025-07-20T20:24:26.232Z [error] ❌ Missing required callback parameters - attempting alternative lookup
2025-07-20T20:24:26.232Z [info] 🔍 Alternative parameter search: {
  altToken: false,
  altConversationId: false,
  allParams: {
    status: 'success',
    paymentId: '3657191304',
    conversationData: '',
    conversationId: 'conv_1753043052817_6tlo8phvw',
    mdStatus: '1',
    signature: '24e654a6b4435b4a1c91e52d467a9e15da6fed1013bb226607c9dc8734f8a23f'
  }
}
2025-07-20T20:24:26.232Z [info] ⏳ İlk 3DS callback tespit edildi - 3DS başlatıldı ama henüz tamamlanmadı: {
  conversationId: 'conv_1753043052817_6tlo8phvw',
  paymentId: '3657191304',
  status: 'success',
  mdStatus: '1'
}
2025-07-20T20:24:26.840Z [info] 📊 Transaction PENDING (3DS initiated) olarak güncellendi: SIP-1753043052081
2025-07-20T20:24:26.997Z [info] 🔍 Debug event kaydedildi [info]: callback_processing
--
2025-07-20T20:24:41.145Z [info] 🔧 İyzico config oluşturuluyor: {
  testMode: false,
  baseUrl: 'https://api.iyzipay.com',
  hasApiKey: true,
  hasSecretKey: true
}
2025-07-20T20:24:41.146Z [info] 📋 Non-form callback body: {"paymentConversationId":"conv_1753043052817_6tlo8phvw","merchantId":709571,"paymentId":3657191304,"status":"CALLBACK_THREEDS","iyziReferenceCode":"c950dc31-4a26-4e9b-a2d6-01c31b1e69c2","iyziEventType":"THREE_DS_CALLBACK","iyziEventTime":1753043065238,"iyziPaymentId":3657191304}
2025-07-20T20:24:41.146Z [info] 🔄 JSON callback parse ediliyor...
2025-07-20T20:24:41.146Z [info] ✅ JSON callback parsed: {
  paymentConversationId: 'conv_1753043052817_6tlo8phvw',
  merchantId: 709571,
  paymentId: 3657191304,
  status: 'CALLBACK_THREEDS',
  iyziReferenceCode: 'c950dc31-4a26-4e9b-a2d6-01c31b1e69c2',
  iyziEventType: 'THREE_DS_CALLBACK',
  iyziEventTime: 1753043065238,
  iyziPaymentId: 3657191304
}
2025-07-20T20:24:41.147Z [info] 🎯 JSON callback parametreleri convert edildi: {
  conversationId: 'conv_1753043052817_6tlo8phvw',
  status: 'CALLBACK_THREEDS',
  paymentId: 3657191304,
  eventType: 'THREE_DS_CALLBACK'
}
2025-07-20T20:24:41.147Z [info] 🔄 İyzico Callback Received: {
  method: 'POST',
  url: 'https://www.ardahanticaret.com/api/payment/iyzico/callback',
  conversationId: 'conv_1753043052817_6tlo8phvw',
  status: 'CALLBACK_THREEDS',
  mdStatus: null,
  token: 'undefined...',
  allFormFields: [
    'paymentConversationId',
    'merchantId',
    'paymentId',
    'status',
    'iyziReferenceCode',
    'iyziEventType',
    'iyziEventTime',
    'iyziPaymentId',
    'conversationId'
  ],
  timestamp: '2025-07-20T20:24:41.146Z'
}
2025-07-20T20:24:41.147Z [info] 📋 İyzico Callback Full Form Data: {
  paymentConversationId: 'conv_1753043052817_6tlo8phvw',
  merchantId: '709571',
  paymentId: '3657191304',
  status: 'CALLBACK_THREEDS',
  iyziReferenceCode: 'c950dc31-4a26-4e9b-a2d6-01c31b1e69c2',
  iyziEventType: 'THREE_DS_CALLBACK',
  iyziEventTime: '1753043065238',
  iyziPaymentId: '3657191304',
  conversationId: 'conv_1753043052817_6tlo8phvw'
}
2025-07-20T20:24:41.147Z [info] 📨 İyzico Callback Headers: {
  accept: 'application/json, application/*+json',
  'accept-encoding': 'gzip, x-gzip, deflate',
  connection: 'close',
  'content-length': '279',
  'content-type': 'application/json',
  forwarded: 'for=213.226.118.16;host=www.ardahanticaret.com;proto=https;sig=0QmVhcmVyIGY5OTQ5YWE5ZGRhYWFlOTMyMzRkMTBmMmY3MzE0YjlmYTBjMDdjNWE3MTAwOGM2OGQ4ZmM0ZDI3ZGYyZjg5MmI=;exp=1753043380',
  host: 'www.ardahanticaret.com',
  'user-agent': 'Apache-HttpClient/5.2.3 (Java/17.0.14)',
  'x-api-version': 'V1',
  'x-forwarded-for': '213.226.118.16',
  'x-forwarded-host': 'www.ardahanticaret.com',
  'x-forwarded-port': '443',
  'x-forwarded-proto': 'https',
  'x-iyz-signature': '',
  'x-matched-path': '/api/payment/iyzico/callback',
  'x-real-ip': '213.226.118.16',
  'x-vercel-deployment-url': 'ardahanticaret-mxsrnbi0w-rdhns-projects.vercel.app',
  'x-vercel-forwarded-for': '213.226.118.16',
  'x-vercel-id': 'fra1::r4w2b-1753043080769-4753cd84efed',
  'x-vercel-internal-bot-check': 'skip',
  'x-vercel-internal-ingress-bucket': 'bucket017',
  'x-vercel-ip-as-number': '200016',
  'x-vercel-ip-city': 'Istanbul',
  'x-vercel-ip-continent': 'AS',
  'x-vercel-ip-country': 'TR',
  'x-vercel-ip-country-region': '34',
  'x-vercel-ip-latitude': '41.0146',
  'x-vercel-ip-longitude': '28.9532',
  'x-vercel-ip-postal-code': '34096',
  'x-vercel-ip-timezone': 'Europe/Istanbul',
  'x-vercel-ja4-digest': 't13d311300_e8f1e7e78f70_3093c12c0b9d',
  'x-vercel-oidc-token': 'eyJraWQiOiJtcmstNDMwMmVjMWI2NzBmNDhhOThhZDYxZGFkZTRhMjNiZTciLCJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NTMwNDA1NTYsIm93bmVyX2lkIjoidGVhbV9ZVFhlTE51aDhBUWtTdExCN3gzeTg2UWgiLCJpYXQiOjE3NTMwNDA1NTYsInZlcmNlbF9pZCI6ImZyYTE6OjdkdjZ4LTE3NTMwNDA1NTYyMzMtZGRiMmFiZDdkM2RiIiwiYXVkIjoiaHR0cHM6XC9cL3ZlcmNlbC5jb21cL3JkaG5zLXByb2plY3RzIiwib3duZXIiOiJyZGhucy1wcm9qZWN0cyIsImlzcyI6Imh0dHBzOlwvXC9vaWRjLnZlcmNlbC5jb21cL3JkaG5zLXByb2plY3RzIiwicHJvamVjdF9pZCI6InByal9kZ2NnanVyT0NiaWhPUW04V3FVVkNOalN0YjFyIiwiZXhwIjoxNzUzMDQ0MTU2LCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJzY29wZSI6Im93bmVyOnJkaG5zLXByb2plY3RzOnByb2plY3Q6YXJkYWhhbnRpY2FyZXQ6ZW52aXJvbm1lbnQ6cHJvZHVjdGlvbiIsInN1YiI6Im93bmVyOnJkaG5zLXByb2plY3RzOnByb2plY3Q6YXJkYWhhbnRpY2FyZXQ6ZW52aXJvbm1lbnQ6cHJvZHVjdGlvbiIsInByb2plY3QiOiJhcmRhaGFudGljYXJldCJ9.WgQSC6t7NTWv73Uj4_KXdqt2CW3XH72N4nqLfkhH-sDhg_XRLnRBbdREeHsKLSOGPgZz7TVtoct5HejdMjrw2Djp4Yiy4m3SXI0VBt5P06jZtUQodXNG8CcFcQ3cONslSIdVWFxz8D6g2xqnh_X7nLSZVm9AjmAVbAvN59ocGmD3RXlHc775_fi936Dg-wlvezLl4etwP4bOodakY4Ih4rdNIIHdDuQFtkFAp6adV2m6EjPpwxoTg7h8Fxig_rRrg4-OW8yJTDN6KS9VBOB_z8Jw6r7IxMcWdW5LcxPi-B85vb8vB5TkqGDYJ4YYKMO3EeepMNbWxcQ2UZJkPFoN8g',
  'x-vercel-proxied-for': '213.226.118.16',
  'x-vercel-proxy-signature': 'Bearer f9949aa9ddaaae93234d10f2f7314b9fa0c07c5a71008c68d8fc4d27df2f892b',
  'x-vercel-proxy-signature-ts': '1753043380',
  'x-vercel-sc-basepath': '',
  'x-vercel-sc-headers': '{"x-vercel-function-platform":"vercel\\/proxy+serverless","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50SWQiOiJkcGxfRE5WUWo1aHZQaDdZN21kVTZHWjZTalJheVNjZiIsInVubGltaXRlZCI6ZmFsc2UsInBsYW4iOiJob2JieSIsImlzcyI6InNlcnZlcmxlc3MiLCJkb21haW4iOiJ3d3cuYXJkYWhhbnRpY2FyZXQuY29tIiwiYmxvY2siOmZhbHNlLCJpYXQiOjE3NTMwNDMwODAsInByb2plY3RJZCI6InByal9kZ2NnanVyT0NiaWhPUW04V3FVVkNOalN0YjFyIiwiZXhwIjoxNzUzMDQ0MDAwLCJvd25lcklkIjoidGVhbV9ZVFhlTE51aDhBUWtTdExCN3gzeTg2UWgiLCJyZXF1ZXN0SWQiOiJyNHcyYi0xNzUzMDQzMDgwNzY5LTQ3NTNjZDg0ZWZlZCIsImVudiI6InByb2R1Y3Rpb24ifQ.wUwAFIfTMo1z8S9kOfjJ9bmqXDwlQNZcgphR78FP91E"}',
  'x-vercel-sc-host': 'iad1.suspense-cache-blue.vercel-infra.com'
}
2025-07-20T20:24:41.147Z [info] 🔍 Kritik Parameter Kontrolü: {
  tokenExists: false,
  tokenLength: 0,
  conversationIdExists: true,
  conversationIdValue: 'conv_1753043052817_6tlo8phvw',
  statusValue: 'CALLBACK_THREEDS',
  mdStatusValue: null,
  allParamKeys: [
    'paymentConversationId',
    'merchantId',
    'paymentId',
    'status',
    'iyziReferenceCode',
    'iyziEventType',
    'iyziEventTime',
    'iyziPaymentId',
    'conversationId'
  ],
  totalParamCount: 9
}
2025-07-20T20:24:41.580Z [info] ✅ Transaction log kaydedildi: conv_1753043052817_6tlo8phvw
2025-07-20T20:24:41.580Z [info] ✅ Callback logged: conv_1753043052817_6tlo8phvw
2025-07-20T20:24:41.580Z [info] 🚨 Callback Validation Check: {
  hasToken: false,
  hasConversationId: true,
  receivedParams: [
    'paymentConversationId',
    'merchantId',
    'paymentId',
    'status',
    'iyziReferenceCode',
    'iyziEventType',
    'iyziEventTime',
    'iyziPaymentId',
    'conversationId'
  ],
  formDataCount: 9
}
2025-07-20T20:24:41.580Z [error] ❌ Missing required callback parameters - attempting alternative lookup
2025-07-20T20:24:41.580Z [info] 🔍 Alternative parameter search: {
  altToken: false,
  altConversationId: false,
  allParams: {
    paymentConversationId: 'conv_1753043052817_6tlo8phvw',
    merchantId: '709571',
    paymentId: '3657191304',
    status: 'CALLBACK_THREEDS',
    iyziReferenceCode: 'c950dc31-4a26-4e9b-a2d6-01c31b1e69c2',
    iyziEventType: 'THREE_DS_CALLBACK',
    iyziEventTime: '1753043065238',
    iyziPaymentId: '3657191304',
    conversationId: 'conv_1753043052817_6tlo8phvw'
  }
}
2025-07-20T20:24:41.580Z [info] 🎯 3DS Callback tamamlandı, payment durumu kontrol ediliyor: {
  conversationId: 'conv_1753043052817_6tlo8phvw',
  paymentId: '3657191304',
  status: 'CALLBACK_THREEDS'
}
2025-07-20T20:24:41.580Z [info] 🔍 İyzico payment status kontrol ediliyor: 3657191304
2025-07-20T20:24:41.580Z [info] 📋 Token yok - payment detail endpoint kullanılıyor
2025-07-20T20:24:41.581Z [info] 📡 İyzico API çağrısı: payment/auth/detail {
  url: '/payment/auth/detail',
  conversationId: 'conv_1753043052817_6tlo8phvw',
  token: 'undefined...'
}
2025-07-20T20:24:41.581Z [info] 🔐 İyzico V2 auth oluşturuldu: {
  apiKey: 'G5PVbgN9...',
  randomStringLength: 32,
  uri: '/payment/auth/detail',
  headerName: 'IYZWSv2'
}
2025-07-20T20:24:41.581Z [info] 📤 İyzico request headers: {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: 'IYZWSv2 YXBpS2V5Okc1UFZiZ045RHdrNnA5RkNtczdIamdsWV...',
  url: '/payment/auth/detail',
  method: 'post'
}
2025-07-20T20:24:41.987Z [info] 📊 İyzico payment/auth/detail response: { status: 200, iyzicoStatus: 'failure', conversationId: undefined }
2025-07-20T20:24:41.987Z [info] 📊 İyzico payment detail response: {
  status: 'failure',
  errorCode: '11',
  errorMessage: 'Geçersiz istek',
  locale: 'tr',
  systemTime: 1753043081923
}
2025-07-20T20:24:41.987Z [error] ❌ İyzico Payment Detail Error: {
  status: 'failure',
  errorCode: '11',
  errorMessage: 'Geçersiz istek',
  errorGroup: undefined,
  locale: 'tr',
  conversationId: undefined,
  fullResponse: {
    status: 'failure',
    errorCode: '11',
    errorMessage: 'Geçersiz istek',
    locale: 'tr',
    systemTime: 1753043081923
  }
}
2025-07-20T20:24:41.987Z [error] 🚨 İyzico API Error: {
  errorCode: '11',
  errorMessage: 'Geçersiz istek',
  errorGroup: undefined,
  httpStatus: undefined,
  conversationId: undefined
}
2025-07-20T20:24:41.987Z [info] 📊 Payment status kontrol sonucu: { status: 'failure', errorCode: '11', errorMessage: 'Geçersiz istek' }
2025-07-20T20:24:41.987Z [error] ❌ Ödeme İyzico API tarafından başarısız olarak confirmed: {
  conversationId: 'conv_1753043052817_6tlo8phvw',
  paymentId: '3657191304',
  errorCode: '11',
  errorMessage: 'Geçersiz istek',
  paymentData: undefined,
  fullResult: {
    status: 'failure',
    errorCode: '11',
    errorMessage: 'Geçersiz istek'
  }
}
2025-07-20T20:24:42.281Z [info] 📊 Updating transaction as FAILURE: {
  transactionId: 'fc45d9cf-aae3-4031-b34a-fedaae0d954e',
  orderNumber: 'SIP-1753043052081',
  errorCode: '11',
  errorMessage: 'Geçersiz istek',
  originalAmount: 159,
  paymentId: '3657191304'
}