# League of Legends Tier List - Nasıl Çalıştırılır

Bu proje bir League of Legends şampiyon tier list uygulamasıdır. İki ana bileşenden oluşur:
- **Client**: SvelteKit ile geliştirilmiş frontend
- **Server**: Express.js ile geliştirilmiş backend API

## Gereksinimler

- Node.js (v16 veya üzeri)
- npm (Node Package Manager)

## Kurulum

### 1. Bağımlılıkları Yükleyin

Projenin hem client hem de server kısımları için bağımlılıkları yüklemeniz gerekir.

**Client için:**
```bash
cd client
npm install
```

**Server için:**
```bash
cd server
npm install
```

## Projeyi Çalıştırma

Projeyi çalıştırmak için **hem server hem de client'ı ayrı terminal pencerelerde başlatmalısınız**.

### 1. Server'ı Başlatın

İlk terminal penceresinde:
```bash
cd server
npm run dev
```

Server başarıyla başladığında şu mesajı göreceksiniz:
```
Server running on http://localhost:3002
```

### 2. Client'ı Başlatın

İkinci terminal penceresinde:
```bash
cd client
npm run dev
```

Client başarıyla başladığında şu mesajı göreceksiniz:
```
Local: http://localhost:5173/
```

### 3. Tarayıcıda Açın

Tarayıcınızda şu adresi açın:
```
http://localhost:5173
```

## Port Bilgileri

- **Client**: http://localhost:5173
- **Server**: http://localhost:3002

## Özellikler

- **Tier List**: Şampiyonları sürükle-bırak ile tier'lara yerleştirin
- **Drafting**: Takım draft simülasyonu yapın
- **Dil Desteği**: EN, KR, TR dil seçenekleri
- **Highlighter**: Şampiyonları renklerle vurgulayın
- **Tier Düzenleme**: Kendi tier'lerinizi oluşturun ve özelleştirin

## Sorun Giderme

### Port 3002 zaten kullanılıyor hatası

Eğer "EADDRINUSE: address already in use :::3002" hatası alırsanız:

**Windows için:**
```bash
netstat -ano | findstr :3002
taskkill /PID [PID_NUMARASI] /F
```

**Mac/Linux için:**
```bash
lsof -ti:3002 | xargs kill -9
```

### Client veya Server başlamıyor

1. `node_modules` klasörünü silin ve yeniden `npm install` çalıştırın
2. Node.js sürümünüzün güncel olduğundan emin olun
3. Port'ların başka bir uygulama tarafından kullanılmadığından emin olun

## Build (Production)

Production için build almak isterseniz:

**Client:**
```bash
cd client
npm run build
```

**Server:**
```bash
cd server
npm start
```

## Yardım

Sorunlarla karşılaşırsanız veya önerileriniz varsa issue açabilirsiniz.
