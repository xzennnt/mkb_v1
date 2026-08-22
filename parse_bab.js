const fs = require('fs');

const rawText = `
# BAB 11 #
1 います います Ada, mempunyai
2 います います Ada, tinggal
3 かかります 掛かります Memakan,memerlukan (waktu,uang)
4 やすみます 休みます Tidak masuk (kerj a)
5 ひとつ 一つ Satu buah (bilangan untuk barang)
6 ふたつ 二つ Dua
7 みっつ 三つ Tiga
8 よっつ 四つ Empat
9 いつつ 五つ Lima
10 むっつ 六つ Enam
11 ななつ 七つ Tuj uh
12 やっつ 八つ Delapan
13 ここのつ 九つ Sembilan
14 とお 十 Sepuluh
15 いくつ いくつ Berapa banyak (buah)
16 ひとり 一人 Seorang
17 ふたり 二人 Dua orang
18 —にん —人 ~ orang
19 —だい —台 ~ buah (mesin,mobil)
20 —まい —枚 ~ lembar (benda tipis)
21 —かい —回 ~ kali
22 りんご 林檎 Apel
23 みかん 蜜柑 Jeruk
24 サンドイッチ サンドイッチ Sandwich
2 カレー（ライス） カレー（ライス） Nasi kare
26 アイスクリーム アイスクリーム Eskrim
27 きって 切手 Perangko
28 はがき 葉書 Kartu pos
29 ふうとう 封筒 Amplop
30 そくたつ 速達 Surat kilat
31 かきとめ 書留 Surat tercatat
32 エアメール/ こうくうびん 航空便 Posudara
33 ふなびん 船便 Poslaut 
34 りょうしん 両親 Orang tua
35 きょうだい 兄弟 Saudar a
36 あに 兄 Kakak laki- laki (sendiri)
37 おにいさん お兄さん Kakak laki- laki (orang lain)
38 あね 姉 Kakak perempuan (sendiri)
39 おねえさん お姉さん Kakak perempuan (orang lain)
40 おとうと 弟 Adik laki- laki sendiri
41 おとうとさん 弟さん Adik laki- laki orang lain
42 いもうと 妹 Adik perempuan sendiri
43 いもうとさん 妹さん Adik perempuan orang lain
44 がいこく 外国 Luar negeri
45 ～じかん ～時間 ~ j am
46 ～しゅうかん ～週間 ~ minggu
47 ～かげつ ～ヶ月 ~ bulan
48 ～ねん ～年 ~ tahun
49 ～ぐらい ～ぐらい ~ kira- kira, sekitar
50 どのくらい どのくらい Berapa lama
51 ぜんぶで 全部で Semuanya
52 みんな 皆 Semuanya,seluruhnya (orang)
53 ～だけ ～だけ Hanya ~ saj a
54 いらっしゃいませ いらっしゃいませ Selamat datang
55 いい( お) てんきですね いい( お) 天気ですね Cuacanya bagus, ya…
56 おでかけですか お出かけですか Mau pergi keluar?
57 ちょっと～まで ちょっと～まで Ke ~
58 いって いらっしゃい 行って いらっしゃい Saya pergi
59 いって まいります 行って 参ります Saya segera kembali
60 それから それから Kemudian
61 オーストラリア オーストラリア Australia
62 ていしょく 定食 Satu set makanan/ paketan makanan
63 ランチ ランチ Makan siang
64 てんどん 天丼 Nasi dengan tempura di atasnya
65 おやこどん 親子丼 Nasi dengan daging ayam dan telur di atasnya
66 ぎゅうどん 牛丼 Nasi dengan daging sapi di atasnya
67 やさい いため 野菜炒め Sayur tumis 
68 やきにく 焼肉 Daging panggang
69 つけもの 漬物 Asinan (sayur)
70 みそ しる 味噌汁 Soto tauco Jepang
71 おにぎり お握り Nasi kepal
72 てんぷら てんぷら Gorengan
73 すし 寿司 Sushi
74 うどん 饂 Mi putih Jepang
75 ラーメン ラー麺 Mi kuah cina
76 そば 蕎麦 Mi hitam Jepang
77 やきそば 焼き蕎麦 Mi goreng Jepang
77 おこのみやき お好み焼き Martabak ala Jepang
78 ハンバーグ ハンバーグ Hamburg(nama kota di j erman)
79 コロッケ コロッケ Kroket
80 えびフライ 海老フライ Udang goring tepung roti
81 フライドチキン フライドチキン ayam goring
82 サラダ サラダ Selada
83 スープ スープ Soto\\ sup
84 スパゲティー スパゲティー Spaghetti
85 ピザ ピザ Pizza
86 ハンバーガー ハンバーガー Hamburger
87 サンドウィッチ サンドウィッチ Sandwich
88 トースト トースト Toast (roti panggang)
89 ココア ココア Minuman kokoa
90 コーラ コーラ Cola- cola 
# BAB 12 #
1. かんたん（な） 簡単( な) Mudah
2. ちかい 近い Dekat
3. とおい 遠い Jauh
4. はやい 早い Cepat
5. おそい 遅い Lambat
6. すくない 少ない Sedikit
7. あたたかい 暖かい Hangat
8. すずしい 涼しい Sej uk
9. あまい 甘い Manis
10. からい 辛い Pedas
11. おもい 重い Berat
12. かるい 軽い Ringan
13. いい いい Baik
14. きせつ 季節 Musim
15. はる 春 Musim semi
16. なつ 夏 Musim panas
17. あき 秋 Musim gugur
18. ふゆ 冬 Musim dingin
19. てんき 天気 Cuaca
20. あめ 雨 Huj an
21. ゆき 雪 Salj u
22. くもり 曇り Mendung
23. ホテル ホテル Hotel
24. くうこう 空港 Bandara
25. うみ 海 Laut
26. せかい 世界 Dunia
27. パーティー パーティー Pesta
28. （お）まつり （お）祭り Perayaan, f estival
29. しけん 試験 Uj ian
30. すきやき すき焼き Sukiyaki (semur daging sapi)
31. （お）すし ( お) 寿司 Sushi (nasi yang dicampur dengan cuka diatasnya diberi ikan mentah)
32. さしみ 刺身 Sashimi (irisan daging ikan mentah)
33. てんぷら てんぷら Tempura(gorengan cumi- cumi,udang,sayur) 
34. いけばな 活け花 Seni merangkai bunga
35. もみじ 紅葉 Daun momij i/ maple,daun warna merah
36. どちら どちら Yang mana (dari dua)
37. どちらも どちらも Keduanya
38. ずっと ずっと Jauh lebih (untuk perbandingan)
39. はじめまして 始めまして Untuk pertama kali
40. ただいま ただいま Saya kembali (ungkapan ketika sampai rumah)
41. おかえりなさい お帰りなさい Selamat datang kembali
42. すごいですね 凄いですね Hebat, ya
43 でも でも Akan tetapi
44 つかれた 疲れた Capek, lelah 
# BAB 13 #
1. あそびます 遊びます Bermain
2. およぎます 泳ぎます Berenang
3. むかえます 迎えます Menj emput
4. つかれます 疲れます Lelah, capek
5. だします （てがみ を ～） 出します Mengirim(surat)
6. はいります （きっさてん に～） 入ります Masuk(ke ruang minum/ cof f e shop)
7. でます （きっさてん を～） 出します Keluar(dari ruang minum/ cof f e shop)
8. けっこんします 結婚します Menikah
9. かいものします 買い物します Berbelanj a
10. しょくじします 食事します Makan besar
11. さんぽします （こうえん を～） 散歩します Berj alan- j alan(taman)
12. たいへん（な） 大変（な） Berat, sulit, sukar
13. ほしい 欲しい I ngin, menginginkan
14. さびしい 寂しい Sepi, sunyi
15. ひろい 広い Luas,lebar
16. せまい 狭い Sempit
17. しやくしょ 市役所 Kantor walikota
18. プール プール Kolam renang
19. かわ 川 Sungai
20. けいざい 経済 Ekonomi
21. びじゅつ 美術 Seni
22. つりします 釣りします Memancing
23. スキー スキー Bermain ski
24. かいぎ 会議 Rapat
25. とうろく 登録 Pendaf taran, registr asi
26. しゅうまつ 週末 Akhir minggu/pecan
27. げつまつ 月末 Akhir bulan
28. ねんまつ 年末 Akhir tahun
29. ～ごろ ～ごろ Kira- kira (menyatakan waktu)
30. なにか 何か Sesuatu 
31. どこか 何処か Di suatu tempat
32. おなかがすきました お腹が空きました Lapar
33. おなかがいっぱい お腹がいっぱい Kenyang
34. のどがかわきました 喉が渇きました Haus
35. そうですか そうですか Ya, betul
36. そうしましょう そうしましょう Ya, mari/ baiklah
37. ごちゅうもんは ご注文は Pesanan anda?
38. ていしょく 定食 Makanan set/ paketan
39. ぎゅうどん 牛丼 Gyudon (nasi dengan daging sapi di atasnya)
40. しょうしょうおまちください 少々お待ちください Tolong tunggu sebentar
41. べつべつに 別々に Sendiri- sendiri,masing- masing
42. ロシア ロシア Rusia
43. つるや 鶴や Tsuruya (nama restoran)
44. おはようテレビ おはようテレビ Nama acara televise
45. はくぶつかん 博物館 Museum
46. びじゅつかん 美術館 Gedung kesenian
47. としょかん 図書館 Gedung perpustakaan
48. えいがかん 映画館 Gedung bioskop
49. どうぶつえん 動物園 Kebun binatang
50. しょくぶつえん 植物園 Kebun raya
51. ゆうえんち 遊園地 Taman bermain
52. おてら お寺 Kuil Budha
53. じんじゃ 神社 Kuil Shinto
54. きょうかい 協会 Gerej a
55. モスク モスク Masj id
56. たいいくかん 体育館 Gedung olahraga
57. プール プール Kolam renang
58. こうえん 公園 Taman
59. たいしかん 大使館 Kedutaan besar
60. にゅうこくかんりきょく 入国管理局 Biro imigrasi
61. しやくしょ 市役所 Kantor balaikota
62. けいさつしょ 警察署 Kantor polisi
63. こうばん 交番 Pospolisi
64. しょうぼうしょ 消防署 Pospemadam kebakaran 
65. ちゅうしゃじょう 駐車場 Tempat parkir
66. だいがく 大学 Universitas
67. こうこう 高校 SMU
68. ちゅうがっこう 中学校 SMP
69. しょうがっこう 小学校 SD
70. ようちえん 幼稚園 TK
71. にくや 肉屋 Toko daging
72. パンや パン屋 Toko roti
73. さかなや 魚屋 Toko ikan
74. さかや 酒屋 Toko minuman keras
75. やおや 八百屋 Toko sayur- sayuran
76. きっさてん 喫茶店 Kedai minum
77. コンビに コンビに Toko kecil 24 j am
78. スーパー スーパー Super market, swalayan
79. デパート デパート Departemen store, toserba 
# BAB 14 #
1. つけます 附けます Menyalakan,memasang (listrik)
2. けします 消します Memadamkan,mematikan (listrik)
3. あけます 開けます Membuka
4. しめます 閉めます Menutup
5. いそぎます 急ぎます Terburu- buru,tergesa- gesa
6. まちます 待ちます Menunggu
7. とめます 止めます Menghentika
8. まがります （みぎ へ～） 曲がります （右 へ～） Belok(ke kanan)
9. もちます 持ちます Memegang,membawa
10. とります 取ります Mengambil
11. てつだいます 手伝います Membantu
12. よびます 呼びます Memanggil
13. はなします 話します Berbicara
14. みせます 見せます Memperlihatkan
15. おしえます （じゅしょう を～） 教えます （住所 を～ Memberitahukan,mengaj ar
16. はじめます 始めます Memulai
17. ふります （あめ が～） 降ります （雨 が～） Turun(huj an, salj u)
18. コピーします コピーします Mengkopi
19. エアコン エアコン AC,pendingin ruangan
20. パスポート パスポート Paspor
21. なまえ 名前 Nama
22. じゅうしょ 住所 Alamat
23. ちず 地図 Peta
24. しお 塩 Garam
25. さとう 砂糖 Gula
26. よみかた 読み方 Cara membaca
27. ～かた ～方 Cara -
28. ゆっくり ゆっくり Pelan- pelan
29. すぐ すぐ Segera
30. また また Lagi, berikutnya 
31. あとで 後で Nanti,setelah ini
32. もうすこし もう少し Sedikit lagi
33. もう もう ~ lagi
34. いいですよ いいですよ Tentu
35. さあ さあ Mari/ ayo (digunakan ketika mengaj ak dengan halus)
36. あれ？ あれ？ He? (digunakan ketika menemukan hal aneh)
37. しんごうをみぎへまがってください 信号を右へ曲がってください Tolong belok kanan di tempat lampu lalu lintas
38. まっすぐ 真っ直ぐ Terus
39. これでおねがいします これでお願いします Tolong yang ini
40. おつり お釣り Uang kembalian
41. うめだ 梅田 Nama kota di Osaka 
# BAB 15 #
1. たちます 立ちます Berdiri
2. すわります 座ります Duduk
3. つかいます 使います Memakai, menggunakan
4. おきます 置きます Menaruh,meletakkan
5. つくります 作ります Membuat, memproduksi
6. うります 売ります Menj ual
7. しります 知ります Tahu, kenal
8. すみます 住みます Tinggal, menempati
9. けんきゅうします 研究します Meneliti
10. しっています 知っています Mengetahui, mengenal
11. すんでいます （おおさか に～） 住んでいます （大阪 に～） Sedang tinggal/ menempati(di oosaka)
12. しりょう 資料 Data,bahan- bahan
13. カタログ カタログ Catalog
14. じこくひょう 時刻表 Jadwal
15. ふく 服 Pakaian
16. せいひん 製品 Komoditi,barang j adi
17. ソフト ソフト Sof tware,perangkat lunak
18. せんもん 専門 Jurusan, keahlian
19. はいしゃ 歯医者 Dokter gigi
20. とこや 床屋 Tukang pangkasrambut, tukang cukur
21. プレイガイド プレイガイド Tempat penj ualan karcis
22. どくしん 独身 Buj ang,belum berkeluarga
23. とくに 特に Khususnya, terutama
24. おもいだします 思い出します Mengingat, merasa
25. （ご）かぞく （ご）家族 Keluarga (untuk orang lain)
26. いらっしゃいます いらっしゃいます Ada ( lebih sopan dari います)
27. こうこう 高校 SMU
28. にほんばし 日本橋 Nama tempat di Osaka 
`;

fs.writeFileSync('raw_bab11_15.txt', rawText);
console.log('Saved 11-15');
