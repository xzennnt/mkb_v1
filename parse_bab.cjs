const fs = require('fs');

const rawText1 = `
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

const rawText2 = `
# BAB 16 #
1 のります （でんしゃ に～） 乗ります （電車 に～） Naik (ke kereta api)
2 おります （でんしゃ を～） 降ります （電車 を～） Turun (ke kereta api)
3 のりかえます 乗り換えます Ganti/ pindah kendaraan
4 あびます （シャワー を～） 浴びます （シャワー を～） Mandi
5 いれます 入れます Memasukkan
6 だします 出します Mengeluarkan (barang,pendapat)
7 はいります （だいがく に～) 入ります （大学 に～） Masuk(universitas)
8 でます （だいがく を～） 出ます （大学 を～） Menamatkan (universitas)
9 やめます （かいしゃ を～） 止めます （会社 を～） Meninggalkan, berhenti (kerj a)
10 おします 押します Menekan, mendorong
11 わかい 若い Muda
12 ながい 長い Panj ang
13 みじかい 短い Pendek, singkat
14 あかるい 明るい Terang
15 くらい 暗い Gelap
16 せがたかい 背が高い Postur tinggi
17 あたまがいい 頭がいい Pintar, pandai
18 からだ 体 Badan, tubuh
19 あたま 頭 Kepala
20 かみ 髪 Rambut kepala
21 かお 顔 Waj ah
22 め 目 Mata
23 みみ 耳 Telinga
24 くち 口 Mulut
25 は 歯 Gigi
26 おなか お腹 Perut
27 あし 足 Kaki 
28 サービス サービス Pelayanan
29 ジョギング ジョギング Jogging
30 シャワー シャワー Shower
31 みどり 緑 Hij au
32 おてら お寺 Kuil Budha
33 じんじゃ 神社 Kuil Shinto
34 りゅうがくせい 留学生 Mahasiswa asing
35 ～ばん ～番 Nomor -
36 どうやって どうやって Dengan cara bagaimana
37 どの どの Yang mana (lebih dari tiga)
38 （いいえ）まだまだです （いいえ）まだまだです Tidak, belum memuaskan (ungkapan merendahkan diri)
39 おひきだしですか お引き出しですか Apakah anda mau mengambil uang? (bank/ atm)
40 まず まず Pertama- tama
41 キャッシュカード キャッシュカード Kartu cash, kartu ATM
42 あんしょうばんごう 暗証番号 Nomor PI N
43 つぎに 次に Selanj utnya, kemudian
44 きんがく 金額 Jumlah uang
45 かくにん 確認 Penegasan, konf irmasi
46 ボタン ボタン Tombol
47 JR JR Japan Railways (perusahaan kereta api Jepang)
48 アジア アジア Asia
49 バンドン バンドン Bandung
50 ベラクルス ベラクルス Velacruz (Mexico)
51 フランケン フランケン Franken ( Jerman)
52 ベトナム ベトナム Vietnam
53 フェ フェ Hue (Vietnam)
54 だいがくまえ だいがくまえ Nama halte bus(hanya perumpamaan) 

# BAB 17 #
1. おぼえます 覚えます Mengingat,menghaf al
2. わすれます 忘れます Lupa
3. なくします 無くします Hilang, kehilangan
4. だします （レポート を～） 出します （レポート を～） Menyer ahkan(laporan)
5. はらいます 払います Membayar
6. かえします 返します Mengembalikan
7. でかけます 出かけます Pergi ke luar, berangkat ke luar
8. ぬぎます 脱ぎます Menanggalkan,mencopoti,melepaskan (pakaian)
9. もっていきます 持って行きます Membawa pergi (barang)
10. もってきます 持って来ます Membawa datang (barang)
11. もってかえります 持って帰ります Membawa pulang (barang)
12. しんぱいします 心配します Cemas,khawatir
13. ざんぎょうします 残業します Lembur (kerj a)
14. しゅっちょうします 出張します Dinaske luar kota
15. のみます （くすり を ～） 飲みます （薬 を～） Minum(obat)
16. はいります （おふろ に ～） 入ります （お風呂 に ～） Masuk(ke kamar mandi)
17. たいせつ（な） 大切（な） Penting,berharga,bernilai
18. だいじょうぶ（な） 大丈夫（な） Tidak apa- apa
19. あぶない 危ない Berbahaya
20. もんだい 問題 Pertanyaan, masalah
21. こたえ 答え Jawaban
22. きんえん 禁煙 Larangan merokok
23. （けんこう） ほうけんしょう （健康）法検証 Kartu asuransi (kesehatan)
24. かぜ 風 Angin
25. かぜ 風邪 Masuk angin
26. ねつ 熱 Panasbadan, demam
27. びょうき 病気 Penyakit, sakit
28. くすり 薬 Obat
29. おふろ お風呂 Kamar mandi
30. うわぎ 上着 Jaket 
31. したぎ 下着 Pakaian dalam
32. せんせい 先生 Dokter (panggilan untuk dokter)
33. ２， ３にち ２， ３日 2 atau 3 hari
34. ～まで に ～まで に Paling lambat sebelum(batas waktu)
35. ですから ですから Oleh karena itu
36. どうしましたか どうしましたか Ada apa?
37. （が）いたい です （が）痛い です (- ) sakit
38. のど 喉 Tenggorokan
39. おだいじに お大事に Semoga lekassembuh 

# BAB 18 #
1. できます 出来ます Dapat,bisa,mampu
2. あらいます 洗います Mencuci
3. ひきます 引きます Menarik
4. ひきます 弾きます Bermain (piano,gitar)
5. うたいます 歌います Bernyanyi
6. あつめます 集めます Mengumpulkan
7. すてます 捨てます Membuang
8. かえます 変えます Mengganti, menukar
9. うんてんします 運転します Mengemudi, menyetir
10. よやくします 予約します Memesan
11. ピアノ ピアノ Piano
12. ～メートル ～メートル ～Meter
13. こくさい 国際 I nternasional
14. げんきん 現金 Uang kontan, uang tunai
15. しゅみ 趣味 Kegemaran, hobi
16. にっき 日記 Catatan harian, buku diary
17. おいのり お祈り Doa,sembahyang
18. おいのりします お祈りします Berdoa, bersembahyang
19. いのります 祈ります Berdoa, bersembahyang
20. かいちょう 会長 Presiden (komunitas),kepala komunitas
21. ぶちょう 部長 Kepala bagian, kepala departemen
22. しゃちょう 社長 Kepala perusahaan
23. どうぶつ 動物 Binatang
24. うま 馬 Kuda
25. へえ へえ Masa?(digunakan ketika terkej ut/ kagum)
26. それはおもしろいですね それは面白いですね I tu menarik ya…
27. なかなか 中々 Tidak mudah, sulit sekali (diikuti bentuk negative)
28. ぼくじょう 牧場 Padang rumput ternak
29. ほんとうですか 本当ですか Benarkah?
30. ぜひ 是非 Benar- benar,mesti (berkeinginan atau mengaj ak)
31. ビートルズ ビートルズ Beatles(band I nggris) 

# BAB 19 #
1. のぼります 上ります/ 登ります Naik, mendaki
2. とまります （ホテル に ～） 泊まります （ホテル に ～） Menginap,bermalam(di hotel)
3. そうじします 掃除します Membersihkan
4. せんたくします 選択します Mencuci
5. れんしゅうします 練習します Berlatih
6. なります 成ります Menj adi
7. ねむい 眠い Mengantuk
8. つよい 強い Kuat
9. よわい 弱い Lemah
10. ちょうしがいい 調子がいい Kondisi badan baik
11. ちょうしがわるい 調子が悪い Kondisi badan kurang baik
12. ちょうし 調子 Kondisi, keadaan (badan)
13. ゴルフ ゴルフ Golf
14. すもう 相撲 Sumo
15. パチンコ パチンコ Alat j udi Jepang
16. お茶 お茶 The
17. ちゃのゆ 茶の湯 Upacara minum teh
18. ひ 日 Hari
19. いちど 一度 Satu kali
20. いちども 一度も Satu kalipun tidak (diikuti bentuk negatif )
21. だんだん だんだん Berangsur- angsur
22. もうすぐ もうすぐ Tidak lama lagi
23. おかげさまで お蔭様で Berkat doa/ bantuan Anda
24. かんぱい 乾杯 Tos,bersulang (diucapkan ketika bersulang)
25. じつ は 実は Sebenarnya…
26. ダイエット ダイエット Diet
27. ダイエットします ダイエットします Berdiet
28. なんかいも 何回も Beberapa kali pun
29. しかし しかし Akan tetapi
30. むり（な） 無理（な） Berlebihan, mustahil
31. からだ に いい 体にいい Baik untuk badan
32. ケーキ ケーキ Cake, kue Eropa 
33. かつしかほくさい 葛飾北斎 Pelukisdan pengukir papan kayu pada zaman edo ( 1760- 1849) 
`;

const rawText3 = `
# BAB 20 #
1. いります（ビザ が～） 要ります（ビザ が～） Memerlukan(visa)
2. しらべます 調べます Memeriksa,menyelidiki
3. なおします 直します Memperbaiki,membetulkan
4. しゅうりします 修理します Memperbaiki (alat/ service)
5. でんわします 電話します Menelepon
6. ぼく 僕 Aku ( kata ganti orang inf ormal pengganti 私)
7. きみ 君 Kamu ( kata ganti orang inf ormal pengganti あなた)
8. ～くん ～君 Saudara ~ ( pengganti ~さん)
9. うん うん Ya (inf ormal)
10. ううん ううん Tidak (inf ormal)
11. サラリーマン サラリーマン Pegawai, karyawan perusahaan
12. ことば 言葉 Kata, Bahasa, I stilah
13. ぶっか 物価 Harga barang
14. きもの 着物 Kimono
15. ビザ ビザ Visa
16. はじめ 始め Awal,mula- mula
17. おわり 終わり Akhir, selesai
18. こっち こっち Sini ( inf ormal dari こちら)
19. そっち そっち Situ ( inf ormal dari そちら)
20. あっち あっち Sana ( inf ormal dari あちら)
21. どっち どっち Yang mana/ sebelah mana ( inf ormal dari どちら)
22. このあいだ この間 Tempo hari,beberapa hari yang lalu
23. みんなで 皆で Kita semua, kami semua
24. ～けど ～けど ～、tetapi ( inf ormal dari ~が)
25. くに へ かえるの？ 国 へ 帰るの？ Apakah kamu pulang ke negaramu?
26. どうするの？ どうするの？ Bagaimana kamu akan melakukannya?
27. どうしようかな～ どうしようかな～ Bagaimana melakukannya ya..(ngomong sendiri)
28. よかったら よかったら Jika kamu bersedia, j ika kamu mau
29. いろいろ 色々 Segala sesuatunya… 

# BAB 21 #
1. おもいます 思います Mengira,berpikir,menduga
2. いいます 言います Berkata, mengatakan
3. たります 足ります Cukup,mencukupi
4. かちます 勝ちます Menang
5. まけます 負けます Kalah
6. あります （おまつり が～） あります （お祭り が ～） Ada(f estival)
7. やく に たちます 役に立ちます Berguna,berf aedah,bermanf aat
8. むだ（な） 無駄（な） Tidak berguna,sia- sia
9. ふべん（な） 不便（な） Tidak praktis
10. おなじ 同じ Sama
11. すごい 凄い Hebat,bukan main
12. しゅしょう 首相 Perdana menteri
13. だいとうりょう 大統領 Presiden
14. せいじ 政治 Politik
15. ニュース ニュース Berita
16. スピーチ スピーチ Pidato
17. しあい 試合 Pertandingan
18. アルバイト アルバイト Kerj a sambilan
19. いけん 意見 Pendapat
20. （お）はなし （お）話 Pembicaraan, cerita
21. ユーモア ユーモア Lelucon, humor
22. むだ 無駄 Kesia- siaan
23. デザイン デザイン Desain, model
24. こうつう 交通 Lalu lintas,transportasi
25. ラッシュ ラッシュ Jam sibuk
26. さいきん 最近 Akhir- akhir ini,belakangan ini
27. たぶん 多分 Barangkali, mungkin
28. きっと きっと Pasti
29. ほんとうに 本当に Benar- benar
30. そんなに そんなに Tidak begitu (diikuti bentuk negatif ) 
31. ～に ついて ～に ついて Tentang
32. しかた が ありません 仕方がありません Apa boleh buat/ Tidak ada pilihan lain
33. ～でも のみませんか ～でも 飲みませんか Bagaimana kalau kita minum/ apa saj a
34. しばらくですね しばらくですね Sudah lama tidak berj umpa…
35. もちろん もちろん Tentu saj a
36. みないと。。。 見ないと。。。 Saya harusmenonton itu
37. カンガルー カンガルー Kangguru
38. キャプテンクック キャプテンクック Kapten j amescook (1728- 1779 

# BAB 22 #
1. きます （シャツ を ～） 着ます （シャツ を ～） Memakai (baj u,kemej a)
2. はきます （くつ を～） 履きます （靴 を～） Memakai (sepatu,rok)
3. かぶります （ぼうし を ～） 被ります （防止 を～） Memakai (topi,dll)
4. かけます （めがね を ～） 掛けます （眼鏡 を～） Memakai (kacamata)
5. うまれます 生まれます Lahir
6. コート コート Mantel, j as
7. スーツ スーツ Setelan pakaian/ j as
8. セーター セーター Sweater,pakaian hangat
9. ぼうし 帽子 Topi
10. めがね 眼鏡 Kacamata
11. よく よく Sering kali,dengan baik
12. おめでとうございます おめでとうございます Selamat! (untuk ulang tahun, pernikahan, tahun baru,dll)
13. こちら こちら I ni( bentuk sopan dari こちら)
14. やちん 家賃 Sewa rumah
15. うーん うーん Ehm
16. ダイニングキチン ダイニングキチン Ruang makan dengan dapur j adi satu
17. わしつ 和室 Kamar ala Jepang
18. おしいれ 押入れ Closet, lemari dinding ala Jepang
19. ふとん 布団 Futon, kasur ala Jepang
20. アパート アパート Apartemen
21. パリ パリ Paris
22. ばんりのちょうじょう 万里の長城 Tembok Besar China
23. よかかいはつセンター 余暇開発センター Pusat pengembangan pemanf aatan waktu luang
24. レジャーはくしょ レジャー白書 Buku putih yang memuat tentang pemanf aatan waktu luang 

# BAB 23 #
1. ききます （せんせい に～） きます （先生 に～） Bertanya( ke guru)
2. まわします 回します Memutar
3. ひきます 引きます Menarik
4. かえます 変えます Mengubah
5. さわります （ドア に～） 触ります （ドア に～） Mengetuk, menyentuh, meraba(pintu)
6. でます （おつり が ～） 出ます （おつり が ～） Keluar (kembalian) dari mesin
7. うごきます （とけい が ～） 動きます （時計 が～） Bergerak, berputar(j am)
8. あるきます （みち を～） 歩きます （道 を～） Berj alan kaki
9. わたります （はし を～） 渡ります （橋 を～） Menyeberang(j embatan)
10. きをつけます （くるま に ～） 気を付けます （車 に～） Berhati- hati, memperhatikan(mobil)
11. ひっこしします 引越しします Pindah rumah
12. でんきや 電気屋 Toko elektronik,tukang alat- alat listrik
13. サイズ サイズ Ukuran
14. おと 音 Bunyi
15. きかい 機械 Mesin
16. つまみ 撮み Tuas,engsel,tombol
17. こしょう 故障 Kerusakan
18. こしょうします 故障します Rusak
19. みち 道 Jalan
20. こうさてん 交差点 Persimpangan/ perempatan j alan
21. しんごう 信号 Lampu lalu lintas
22. かど 角 Sudut
23. はし 橋 Jembatan
24. ちゅうしゃじょう 駐車場 Tempat parkir
25. —め —目 Ke
26. （お）しょうがつ （お）正月 Tahun Baru
27. ごちそうさまでした ご馳走様でした Terima kasih atashidangannya 
28. たてもの 建物 Gedung, bangunan
29. がいこくじんとうろくしょう 外国人登録証 Surat izin pendaf taran orang asing
30. しょうとくたいし 承徳大子 Putera shouoku(574- 622)
31. ほりゅうじ 保留時 Kuil di daerah Nara didirikan oleh putera shoutoku pada permulaan abad ke- 7
32. げんきちゃ 元気茶 Nama teh (hanya perumpamaan)
33. ほんだえき 本田駅 Nama stasiun (hanya perumpamaan)
34. としょかんえき 図書館駅 Nama halte bis (hanya perumpamaan) 

# BAB 24 #
1. くれます 呉れます Memberi (ke pembicara)
2. あげます 上げます Memberi (ke orang lain)
3. もらいます 貰います Menerima (dari orang lain)
4. つれていきます 連れて行きます Membawa pergi (orang)
5. つれてきます 連れて来ます Membawa datang (orang)
6. つれてかえります 連れて帰ります Membawa pulang (orang)
7. おくります （ひと を～） 送ります （人 を～） Mengantar (orang), mengirim (barang)
8. しょうかいします 紹介します Memperkenalkan
9. あんないします 案内します Mengantar melihat- lihat
10. せつめいします 説明します Menj elaskan,menerangkan
11. いれます （コーヒー を～） 淹れます （コーヒー を～） Menyeduh (teh,kopi,dll)
12. おじいさん お祖父さん Kakek
13. おばあさん お祖母さん Nenek
14. じゅんび 準備 Persiapan
15. じゅんびします 準備します Mempersiapkan
16. いみ 意味 Arti, makna
17. おかし お菓子 Kue,makanan kecil
18. ぜんぶ 全部 Semua,seluruh
19. じぶんで 自分で (Oleh) diri sendiri
20. ほかに 他に Yang lain
21. わごんしゃ ワゴン車 Mobil stasiun- wagon
22. おべんとう お弁当 Makanan kotak/ bekal
23. はは の ひ 母の日 Hari I bu 

# BAB 25 #
1. かんがえます 考えます Memikirkan
2. つきます （えき に～） 着きます （駅 に～） Tiba, sampai (di stasiun)
3. りゅうがくします 留学します Belaj ar di luar negeri
4. とります （とし を～） 取ります （年 を～） Menj adi tua/ menua
5. いなか 田舎 Kampung halaman
6. たいしかん 大使館 Kedutaan besar
7. グループ グループ Kelompok,grup
8. チャンス チャンス Kesempatan
9. おく 億 Ratusan j uta
10. いくら （～ても） いくら （～ても） Bagaimana –j uga, seberapa- pun
11. もし （～たら） もし （～たら） Kalau, j ika
12. てんきんします 転勤します Pindah kerj a
13. こと 事 Hal, perkara
14. （いろいろ）おせわになりました （色々）お世話になりました Terima kasih atasbantuannya/ Telah banyak merepotkan
15. がんばります 頑張ります Berusaha,bekerj a keras
16 どうぞおげんきで どうぞお元気で Mudah- mudahan sehat selalu
17. いっぱいのみましょう 一杯飲みましょう Mari kita minum (bir) 
`;

const allText = rawText1 + "\n" + rawText2 + "\n" + rawText3;
const lines = allText.split('\n');

const result = [];
let currentCategory = "";

for (const line of lines) {
  const t = line.trim();
  if (!t) continue;
  
  const babMatch = t.match(/# BAB (\d+) #/);
  if (babMatch) {
    currentCategory = "MNN1_Bab" + babMatch[1];
    continue;
  }
  
  // Parse format: [number][.] [Kana] [Kanji] [Translation]
  // Or: [number][.] [Kana] [Translation]
  const match = t.match(/^(\d+)[.]?\s+(.+)$/);
  if (!match) continue;
  
  let rest = match[2];
  
  // We need to carefully split by spaces but translations might have spaces.
  // Actually, there's always at least 2 tokens before translation, except if there's only 1 (Kana = Kanji).
  // Let's use a simpler heuristic: finding the first Indonesian-looking word (capitalized or not) or just taking the last segments.
  // We can see that Kanji and Kana usually don't have spaces inside them, except if they have parentheses.
  // Better approach: regex to match Japanese parts and Indonesian translation.
  // Usually, Japanese parts contain Hiragana, Katakana, Kanji, or symbols.
  // The translation part contains Latin letters (a-z, A-Z), sometimes symbols.
  
  // Find where the translation starts: the first substring that looks like Indonesian/English (mostly a-z, A-Z, commas, hyphens)
  // Let's split by spaces.
  const parts = rest.split(/\s+/);
  
  let jp = "";
  let translation = "";
  
  // We'll collect parts until we see a word that starts with A-Z or a-z, EXCEPT if it's "AC", "PI N", "JR", "Diet" etc which are in Japanese list sometimes? Wait, "AC" is translation.
  // What if Japanese part is Romaji? No, MNN uses Kana/Kanji.
  // Let's find the first part that contains standard Latin alphabet letters [a-zA-Z] but isn't explicitly just one symbol.
  // Also, some Japanese have ~ (tilde).
  let transStartIndex = -1;
  for (let i = 1; i < parts.length; i++) {
    // If the part has purely Latin characters (and not just A-Z acronyms if we can distinguish, but let's assume Latin = translation)
    if (/[a-zA-Z]/.test(parts[i]) && !/[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195|\u203B]/.test(parts[i])) {
      transStartIndex = i;
      break;
    }
  }
  
  // Special fallback: if no Latin found, maybe it's all Japanese? Unlikely.
  // Or if it's something like "Tsuruya (nama restoran)", transStartIndex will hit "Tsuruya".
  if (transStartIndex === -1) {
    // maybe try to split in half?
    transStartIndex = Math.floor(parts.length / 2) + 1;
  }
  
  // Usually it's: [Kana] [Kanji] [Translation] => parts[0] is Kana, parts[1] is Kanji, parts[2...] is Translation.
  // But sometimes: [Kana] [Translation] => parts[0] Kana, parts[1...] Translation.
  // Let's check parts[1]. If it has Japanese characters, it's Kanji.
  let kana = parts[0];
  let kanji = "";
  
  if (transStartIndex > 1) {
    kanji = parts.slice(1, transStartIndex).join(" ");
  }
  
  translation = parts.slice(transStartIndex).join(" ");
  
  // Sometimes kanji is the same as kana
  let finalJp = kanji && kanji !== kana ? kanji + (kana && kana !== kanji ? ` (${kana})` : '') : kana;
  if (!kanji && kana) finalJp = kana;
  
  result.push({
    jp: finalJp,
    id_translation: translation,
    category: currentCategory
  });
}

// Check some output
console.log(JSON.stringify(result.slice(0, 5), null, 2));
console.log("...");
console.log(JSON.stringify(result.slice(-5), null, 2));

// Save to files based on groupings:
const grouped = {};
for (const item of result) {
  if (!grouped[item.category]) grouped[item.category] = [];
  grouped[item.category].push({ jp: item.jp, id_translation: item.id_translation, category: item.category });
}

fs.writeFileSync('src/data/mnn1_bab11_15.json', JSON.stringify([
  ...(grouped["MNN1_Bab11"] || []),
  ...(grouped["MNN1_Bab12"] || []),
  ...(grouped["MNN1_Bab13"] || []),
  ...(grouped["MNN1_Bab14"] || []),
  ...(grouped["MNN1_Bab15"] || []),
], null, 2));

fs.writeFileSync('src/data/mnn1_bab16_20.json', JSON.stringify([
  ...(grouped["MNN1_Bab16"] || []),
  ...(grouped["MNN1_Bab17"] || []),
  ...(grouped["MNN1_Bab18"] || []),
  ...(grouped["MNN1_Bab19"] || []),
  ...(grouped["MNN1_Bab20"] || []),
], null, 2));

fs.writeFileSync('src/data/mnn1_bab21_25.json', JSON.stringify([
  ...(grouped["MNN1_Bab21"] || []),
  ...(grouped["MNN1_Bab22"] || []),
  ...(grouped["MNN1_Bab23"] || []),
  ...(grouped["MNN1_Bab24"] || []),
  ...(grouped["MNN1_Bab25"] || []),
], null, 2));

console.log('Saved all JSON files.');
