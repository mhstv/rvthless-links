# rvthless links

Link shortener + click tracker kamu sendiri. Gratis selamanya (dalam batas free tier Vercel KV, yang jauh lebih dari cukup buat kebutuhan personal).

## Cara deploy (Vercel)

1. **Push folder ini ke GitHub**
   - Bikin repo baru di GitHub, push semua isi folder ini ke situ.

2. **Import ke Vercel**
   - Buka vercel.com → New Project → pilih repo GitHub kamu → Deploy.

3. **Tambahin Vercel KV (database-nya)**
   - Di dashboard project Vercel kamu → tab **Storage** → **Create Database** → pilih **KV**.
   - Setelah dibuat, klik **Connect Project**, pilih project ini. Vercel otomatis nambahin environment variable yang dibutuhin (KV_URL, dll) — kamu gak perlu setting manual.

4. **Set ADMIN_SECRET**
   - Di project Settings → **Environment Variables** → tambahin:
     - Name: `ADMIN_SECRET`
     - Value: bikin password kamu sendiri, bebas, asal susah ditebak (misal string random panjang)
   - Ini password buat akses /dashboard dan API pembuatan link. JANGAN dikasih tau ke siapa pun.

5. **Redeploy**
   - Setelah nambah env variable, klik **Redeploy** di tab Deployments biar variable-nya kepake.

6. **Connect domain kamu**
   - Di project Settings → **Domains** → tambahin domain giveaway kamu.
   - Ikutin instruksi buat update DNS (biasanya tinggal tambahin CNAME/A record di tempat kamu beli/dapet domainnya).

## Cara pakai

1. Buka `namadomainmu.com/dashboard`
2. Masukin ADMIN_SECRET yang tadi kamu set
3. Bikin link baru: isi slug (misal `fiverr`) dan destination (link Fiverr kamu)
4. Link jadi: `namadomainmu.com/fiverr`
5. Share link itu ke FB/IG/dst
6. Balik ke `/dashboard` kapan aja buat liat total klik + riwayat (waktu, dari mana/referrer)

## Catatan

- Free tier Vercel KV cukup buat ribuan klik per bulan — jauh dari cukup buat kebutuhan personal kayak gini.
- Data klik kamu 100% punya kamu sendiri, gak ada pihak ketiga yang bisa akses.
- Mau nambah link baru kapan aja tinggal buka /dashboard, gak perlu redeploy/coding lagi.
