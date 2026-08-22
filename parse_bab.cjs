const fs = require('fs');

const raw36 = `
1 とどきます 「にもつが～」 届きます 「荷物が～」 (barang) Sampai,tersampaikan
2 でます「しあいに～」 出ます「試合に～」 I kutan
3 うちます 「ワープロを～」 打ちます 「ワープロを～」 Mengetik (word prosessor)
4 ちょきんします 貯金します Menabung
5 ふとります 太ります Menj adi gemuk
6 やせます 痩せます Menj adi kurus
7 すぎます「７じに～」 過ぎます「７時に～」 Berlalu, lebih (pukul 7)
8 なれます 「しゅうかんに～」 慣れます 「習慣に～」 Terbiasa (dengan kebiasaan)
9 かたい 硬い Keras
10 やわらかい 軟らかい Lunak, empuk,kenyal
11 でんし～ 電子～ ～Elektronik
12 けいたい～ 携帯～ ～Telepon genggam,barang genggaman, yang mudah dibawa.
13 こうじょう 工場 Pabrik
14 けんこう 健康 Kesehatan
15 けんどう 剣道 Kendo
16 まいしゅう 毎週 Setiap minggu
17 まいつき 毎月 Setiap bulan
18 まいとし•まいねん 毎年 Setiap tahun
19 やっと やっと Akhirnya
20 かなり 可也 Lumayan, agak
21 かならず 必ず Selalu, pasti
22 ぜったい 絶対 Mutlak, absolute
23 ぜったいに 絶対に Sama sekali, Bagaimanapun (diikuti bentuk negative)
24 じょうず（な） 上手（な） Pandai,j ago,mahir
25 へた（な） 下手（な） Bodoh,tidak terampil
26 じょうずに 上手に Dengan pandai
27 できるだけ 出来るだけ Sedapat mungkin
28 このごろ この頃 Akhir- akhir ini
29 ～ずつ ～ずつ ～demi～
30 そのほうが～ そのほうが～ Yang lebih～
31 ショパン ショパン Chopin, pemusik Polandia
32 おきゃくさま お客様 Pelanggan, Tamu
33 とくべつ（な） 特別（な） I stimewa, special, khusus
34 していらっしゃいます していらっしゃいます Sedang melakukan ( kata hormat untuk しています)
35 すいえい 水泳 Renang
36 ～とか、～とか ～とか、～とか ～, ～, dll
37 タンゴ タンゴ Tango (j enistarian dari Argentina)
38 チャレンジします チャレンジします Menantang
39 きもち 気持ち Keinginan, perasaan
40 のりもの 乗り物 Kendaraan
41 れきし 歴史 Sej arah
42 ～せいき ～世紀 Abad～
43 とおい 遠い Jauh
44 とおく 遠く Kej auhan,tempat yang j auh
45 きしゃ 汽車 Kereta uap
46 きせん 汽船 Kapal uap
47 おおぜいの～ 大勢の～ Banyak, kebanyakan (orang)
48 はこびます 運びます Mengangkut, membawa
49 とびます 飛びます Terbang
50 あんぜん（な） 安全（な） Aman
51 うちゅう 宇宙 Luar angkasa
52 ちきゅう 地球 Bumi
53 ライトきょうだい ライト兄弟 Wright bersaudara, pelopor dalam aviasi Wilbur Wright (1867- 1912) Orville Wright (1871- 1948)
54 けんこう 健康 Kesehatan
55 きそくただしをする 規則正しをする Hidup secara teratur
56 はやね、はやおきをする 早寝、早起きをする Cepat bangun dan bangun lebih awal
57 うんどうする/ スポーツする 運動する/ スポーツする Berolah raga
58 よくあるく よく歩く Banyak berj alan kaki
59 すききらいがない 好き嫌いがない Tidak pilih- pilih makanan
60 えいようのバランスをかんがえてたべる 栄養のバランスを考えて食べる Makan dengan menpertimbangkan gizinya
61 けんこうしんだんをうける 健康診断を受ける Memeriksakan kesehatan
62 よふかしをする 夜更かしをする Sering begadang
63 あまり うんどうしない あまり運動しない Kurang berolah raga
64 すききらいがある 好き嫌いがある Pilih- pilih makanan
65 よくインスタントしょくいひんを たべる よくインスタント食品を食べる Sering menkonsumsi makanan instan
66 がいしょくがおおい 外食が多い Sering makan di luar
67 たばこをすう 煙草を吸う Banyak merokok
68 よくおさけをのむ よくお酒を飲む Sering minum minuman keras
69 いつつのたいせつなえいようと それぞれを 五つの大切な栄養とそれぞれをを含む食べ物 Lima nutrisi penting dan makanan yang mengandung nutrisi
70 たんすいかぶつ 炭水化物 Karbohidrat
71 いも 芋 Umbi- umbian
72 しぼう 脂肪 Lemak
73 たんぽくしつ たんぽく質 Protein
74 とうふ 豆腐 Tahu
75 まめ 豆 Kacang- kacangan
76 カルシウム カルシウム Kalsium
77 のり 海苔 Nori (rumput laut yang dikeringkan membentuk lembaran)
78 かいそう 海草 Rumput laut
79 ビタミン ビタミン Vitamin
`;

const raw37 = `
1 ほめます 褒めます Memuj i
2 しかります 叱ります Memarahi
3 さそいます 誘います Mengaj ak
4 おこします 起こします Membangungkan
5 しょうたいします 招待します Mengundang
6 たのみます 頼みます Meminta tolong
7 ちゅういします 注意します Memperingatkan
8 とります 取ります Mencuri
9 ふみます 踏みます Menginj ak
10 こわします 壊します Merusakkan
11 よごします 汚します Mengotori
12 おこないます 行います Mengadakan
13 ゆしゅつします 輸出します Mengekspor
14 ゆにゅうします 輸入します Mengimpor
15 ほんやくします 翻訳します Menerj emahkan
16 はつめいします 発明します Menciptakan
17 はっけんします 発見します Menemukan
18 せっけいします 設計します Merancang, mendesain
19 こめ 米 Beras
20 むぎ 麦 Gandum
21 せきゆ 石油 Minyak tanah
22 げんりょう 原料 Bahan mentah (hasil alam)
23 デート デート Kencan, Pacaran
24 どろぼう 泥棒 Pencuri
25 けいかん 警官 Polisi
26 けんちくか 建築家 Arsitek
27 かがくしゃ 科学者 Ahli ilmu pengetahuan
28 まんが 漫画 Komik
29 せかいじゅう 世界中 Seluruh dunia
30 ～じゅう ～中 Seluruh～
31 ～によって ～によって oleh～
32 よかったね。 良かったね。 Bagus, ya.
33 ドミニカ ドミニカ Dominika
34 ライトきょうだい ライト兄弟 Wright bersaudara, pelopor dalam aviasi Wilbur Wright (1867- 1912) Orville Wright (1871- 1948)
35 げんじものがたり 源氏物語 “Hikayat Genj i” (cerita roman j epang)
36 むらさきしきぶ 紫式部 Pengarang cerita roman Zaman Heian (abad 9) yang membuat “Hikayat Genj i” (973?-1014?)
37 グラハム•ベル グラハム•ベル Alexander Graham Bell, penemu Amerika (1847-1922)
38 とうしょうぐう 東照宮 Kuil Shinto yan diper sembahkan kepada Tokugawa I eyasu, yang ada di Nikko, Prefektur Tochigi
39 えどじだい 江戸時代 Zaman Edo (1603- 1868)
40 サウジアラビア サウジアラビア Saudi Arabia
41 うめたてます 埋め立てます Menimbuni
42 ぎじゅつ 技術 Teknik, teknologi
43 とち 土地 Tanah
44 そうおん 騒音 Suara bising,kebisingan,kegaduhan
45 りようします 利用します Memanf aatkan, menggunakan
46 アクセス アクセス Jalan masuk, akses
47 ～せいき ～世紀 Abad～
48 ごうか（な） 豪華（な） Megah
49 ちょうこく 彫刻 Seni ukir/ pahat
50 ねむります 眠ります Tidur
51 ほります 彫ります Memahat
52 なかま 仲間 Teman,kawan,sahabat
53 そのあと その後 Sesudah itu
54 いっしょうけんめい 一生懸命 Dengan sekuat tenaga
55 ねずみ 鼠 Tikus
56 いっぴきもいません 一匹もいません Seekor (tikus) pun tidak ada
57 ねむりねこ 眠り猫 Kucing Tidur
58 ひだりじんごろう 左甚五郎 Ahli ukir Jepang, terkenal pada j aman Edo ( 1594- 1651)
59 じこ•じけん 事故・事件 Kecelakaan
60 ころす 殺す Membunuh
61 うつ 撃つ Menembak
62 さす 刺す Menusuk
63 かむ 噛む Menggigit
64 ひく 挽く Menggilas
65 はねる 撥ねる Menabrak
66 しょうとつする 衝突する Tabrakan
67 ついとつする 追突する Menabrak dari belakang
68 ぬすむ 盗む Mencuri
69 ゆうかいする 誘拐する Menculik
70 ハイジャックする ハイジャックする Membaj ak
71 ついらくする 墜落する Jatuh
72 はこぶ 運ぶ Membawa
73 ばくはつする 爆発する Meledak
74 たすける 助ける Menolong
75 ちんぼつする 沈没する Tenggelam
`;

const raw38 = `
1 そだてます 育てます Membesarkan, merawat, mengasuh
2 はこびます 運びます Membawa,mengangkut
3 なくなります 亡くなります Meninggal ( dipakai untuk menyatakan しにます secara halus)
4 にゅういんします 入院します Masuk rumah sakit (rawat inap)
5 たいいんします 退院します Keluar rumah sakit
6 いれます「でんげんを～」 入れます「電源を～」 Menghidupkan (Sumber listrik/ aruslistrik)
7 でんげん 電源 Sumber listrik/ aruslistrik
8 きります「でんげんを～」 切ります「電源を～」 Memutus,mematikan (Sumber listrik/ aruslistrik)
9 かけます「かぎを～」 掛けます「鍵を～」 Mengunci
10 かぎ 鍵 Kunci
11 きもちがいい 気持ちがいい Senang,merasa enak
12 きもちがわるい 気持ちが悪い Jij ik,merasa tidak enak
13 おおき（な） 大き（な） Besar
14 ちいさ（な） 小さ（な） Kecil
15 あかちゃん 赤ちゃん Bayi
16 しょうがっこう 小学校 SD
17 ちゅうがっこう 中学校 SMP
18 こうこう 高校 SMA
19 えきまえ 駅前 Depan stasiun
20 かいがん 海岸 Pantai
21 うそ 嘘 Kebohongan
22 しょるい 書類 Dokumen,surat
23 ～せい ～製 Buatan～
24 「あ」いけない 「あ」行けない Aduh, celaka. (dipakai waktu keliru/ gagal)
25 おさきに「しつれいします」 お先に「失礼します」 Saya permisi duluan
26 しつれいします 失礼します Permisi
27 げんばくどーむ 原爆ドーム Monumen peringatan j atuhnya bom atom di Hiroshima
28 かいらん 回覧 Edaran
29 けんきゅうしつ 研究室 Ruang penelitian
30 きちんと きちんと Dengan rapi
31 せいりします 整理します Merapikan
32 ～というほん ～という本 Buku yang berj udul～
33 はんこ 判子 Cap
34 おします「はんこを～」 押します「判子を～」 Menekan, mencap
35 ふたご 双子 Anak kembar
36 しまい 姉妹 Saudara (perempuan)
37 ５ねんせい 5 年生 Kelas 5
38 にます 似ます Mirip, menyerupai
39 せいかく 性格 Tabiat, sif at
40 おとなしい 大人しい Pendiam,patuh, penurut
41 おとな 大人 Orang Dewasa
42 せわします 世話します Merawat,mengurus
43 じかんがたちます 時間がたちます Waktu berlalu
44 だいすき「な」 大好き「な」 Suka sekali
45 ～てん ～点 angka～,skor～
46 クラス クラス Kelas
47 けんかします 喧嘩します Bertengkar, berkelahi
48 ふしぎ（な） 不思議（な） Luar biasa,aneh
49 ねんちゅうぎょうじ 年中行事 Acara Tahunan di Jepang
50 おしょうがつ お正月 Tahun Baru
51 ひなまつり 雛祭り Festival anak perempuan
52 こどものひ 子供の日 Hari anak- anak
53 たなばた 七夕 Festival Bintang
54 おぼん お盆 Festival Obon
55 おつきみ お月見 Memandang Bulan
56 おおみそか 大晦日 Hari Terakhir Tahun
`;

const raw39 = `
1 こたえます「しつもんを～」 答えます「質問を～」 Menj awab (pertanyaan)
2 たおれます「ビルが～」 倒れます「ビルが～」 [ gedung] Roboh,tumbang
3 やけます「うちが～」「パンが～」「にくが～」 焼けます「内が～」「パンが～」「肉が～」 Terbakar,terpanggang [rumah] Terbakar [roti] terpanggang [daging] terpanggang
4 とおります「みちを～」 通ります「道を～」 Lewat,melewati [ j alan]
5 しにます 死にます Mati, meninggal
6 びっくりします 吃驚します Terkej ut
7 がっかりします がっかりします Kecewa
8 あんしんします 安心します Lega
9 ちこくします 遅刻します Terlambat masuk/ datang
10 そうたいします 早退します Pulang lebih awal/ sebelum waktunya
11 けんかします 喧嘩します Bertengkar, berkelahi
12 りこんします 離婚します Bercerai
13 さいこんします 再婚します Ruj uk, pernikahan kembali
14 ふくざつ（な） 複雑（な） Rumit
15 じゃま（な） 邪魔（な） Mengganggu
16 きたない 汚い Kotor
17 うれしい 嬉しい Senang,gembira
18 かなしい 悲しい Sedih
19 はずかしい 恥ずかしい Malu
20 じしん 地震 Gempa bumi
21 じしん 自信 Percaya diri/ kepercayaan diri
22 たいふう 台風 Topan,taif un
23 かじ 家事 Kebakaran
24 じこ 事故 Kecelakaan
25 （お）みあい （お）見合い Pertemuan pertama karena perj odohan
26 でんわだい 電話代 Tagihan telepon
27 ～だい ～代 Rekening, ongkos, biaya, arif f , sewa
28 フロント フロント Bagian resepsionis (front of f ice) di hotel
29 ～ごうしつ ～号室 Nomor kamar～
30 あせ 汗 Keringat( ～をかけます： berkeringat)
31 せっけん 石鹸 Sabun
32 おおぜい 大勢 Banyak, kebanyakan [ orang]
33 おつかれさまでした お疲れ様でした Terima kasih ataskerj a kerasanda. [ucapan penghargaan atas suatu pekerj aan atau kegiatan yang telah dilakukan kepad teman sej awat/ bawahan]
34 うかがいます 伺います Pergi ( bahasa merendahkan diri untuk いきます)
35 とちゅう 途中 Dalam perj alanan/ OTW
36 トラック トラック Truk
37 ぶつかります ぶつかります Bertubrukan
38 ならびます 並びます Berj ej er,berderet, antri
39 おとな 大人 Orang dewasa
40 ようふく 洋服 Pakaian ala barat
41 せいようかします 西洋化します Westernisasi,penggalakan budaya barat
42 あいます 合います Cocok,sesuai,pantas
43 いまでは 今では Sekarang
44 せいじんしき 成人式 Upacara pada Hari Menj adi Dewasa
45 きもち 気持ち Perasaan
46 うれしい 嬉しい Bahagia, senang
47 たのしい 楽しい Gembira
48 さびしい 寂しい Kesepian
49 かなしい 悲しい Sedih
50 おもしろい 面白い Lucu, menarik
51 うらやましい 羨ましい I ri
52 はずかしい 恥ずかしい Malu
53 なつかしい 懐かしい Rindu , kangen
54 びっくりする 吃驚する Terkej ut,kaget
55 がっかりする がっかりする Kecewa
56 うっとりする うっとりする Terpesona
57 いらいらする いらいらする Gelisah, kesal
58 どきどきする どきどきする Berdebar- debar, dag dig dug
59 はらはらする はらはらする Hati berdebar- debar(merasa khawatir)
60 わくわくする わくわくする Tidak sabar menunggu
`;

const raw40 = `
1 かぞえます 数えます Menghitung
2 はかります 測ります Mengukur
3 はかります 量ります Menimbang (volume)
4 たしかめます 確かめます Memastikan
5 あいます「セイズが～」 合います「セイズが～」 [ ukurannya] Tepat,cocok,sesuai
6 しゅっぱつします 出発します Berangkat
7 とうちゃくします 到着します Tiba
8 よいます 酔います Mabuk
9 きけん（な） 危険（な） Berbahaya, beresiko
10 ひつよう（な） 必要（な） Perlu
11 うちゅう 宇宙 Luar angkasa
12 ちきゅう 地球 Bumi
13 ぼうねんかい 忘年会 Pesta akhir tahun
14 しんねんかい 新年会 Pesta tahun baru
15 にじかい 二次会 Pertemuan setelah pesta
16 たいかい 大会 Perlombaan
17 マラソン マラソン Lari Marathon
18 コンテスト コンテスト Lomba,kontes
19 おもて 表 Bagian muka/ depan/ cover
20 うら 裏 Bagian belakang/ cover belakang
21 へんじ 返事 Respon,balasan
22 もうしこみ 申し込み Lamaran, pendaf taran
23 ほんとう 本当 Benar- benar, kebenaran,f akta
24 まちがい 間違い Kesalahan
25 きず 傷 Luka,cacat,goresan
26 ズボン ズボン Celana panj ang
27 ながさ 長さ Panj angnya
28 おもさ 重さ Beratnya
29 たかさ 高さ Tingginya
30 おおきさ 大きさ Besarnya
31 ～びん ～便 Nomor pesawat terbang
32 ～ごう ～号 Nomor kereta api, skala angin topan
33 ～こ ～個 Satuan untuk benda kecil
34 ～ほん「～ぽん、～ぼん」 ～本 Satuan untuk benda panj ang/ silinder
35 ～はい「～ぱい、～ばい」 ～杯 Satuan untuk cangkir,gelas,dll
36 ～グラム ～グラム Gram
37 ～センチ ～センチ Cm
38 ～ミリ ～ミリ Mm
39 ～キロ ～キロ Kilo
40 ～いじょう ～以上 Lebih dari
41 ～いか ～以下 Kurang dari
42 さあ さあ Bagaimana ya? [ dipakai ketika j awabannya tak pasti]
43 ゴッホ ゴッホ Vincent van Gogh, pelukisBelanda [ 1853- 1890]
44 ゆきまつり 雪祭り Festival salj u di Sapporo
45 のぞみ のぞみ Nama kereta shinkansen
46 JL JL Perusahaan Penerbangan Jepang
47 どうでしょうか どうでしょうか Bagaimana～?[ kata hormat untuk どうですか]
48 クラス クラス Kelas
49 テスト テスト Uj ian
50 せいせき 成績 Raihan, hasil, prestasi
51 ところで 所で Ngomong- ngomong [ untuk mengganti topic pembicaraan]
52 いらっしゃいます いらっしゃいます Datang [ kata hormat untuk きます]
53 ようす 様子 Keadaan,sikap,tingkah laku
54 じけん 事件 Peristiwa, perkara
55 ばくだん 爆弾 Bom
56 つみます 積みます Memuat
57 うんてんしゅ 運転手 Pengemudi/ sopir
58 はなれます 離れます Terpisah, terpencil
59 が が Tetapi
60 きゅうに 急に Mendadak,tiba- tiba
61 うごかします 動かします Menj alankan, menggerakkan
62 うごきます 動きます Bergerak, berputar
63 いっしょうけんめい 一所懸命 Dengan sungguh- sungguh
64 はんにん 犯人 Pelaku kej ahatan, tersangka
65 てにいれます 手に入れます Mendapat, memperoleh
66 いまでも 今でも Sekarang pun
67 うわさします 噂します Menggunj ing,menggosip
68 たんい 単位 Ukuran
69 せん 線 Garis
70 かたち 形 Bentuk
71 もよう 模様 Pola
72 めんせき 面積 Luas
73 へいほうセンチメートル 平方センチメートル Cm2[ sentimeter persegi]
74 へいほうメートル 平方メートル m2[ meter persegi]
75 へいほうキロメートル 平方キロメートル km2[ kilometer persegi]
76 ながさ 長さ Panj angnya
77 ミリ「メートル」 ミリ「メートル」 Mm [ millimeter]
78 センチ「メートル」 センチ「メートル」 Cm [ sentimeter]
79 メートル メートル Meter
80 キロ「メートル」 キロ「メートル」 Km [ kilometer]
81 たいせき•ようせき 体積・容積 Volume
82 りっぽうセンチメートル 立法センチメートル Cm3[ sentimeter kubik]
83 りっぽうメートル 立法メートル m3[ meter kubik]
84 ミリリットル ミリリットル Milliliter
85 シーシー シーシー Cc
86 リットル リットル Liter
87 おもさ 重さ Beratnya
88 ミリグラム ミリグラム Mg[ milligram]
89 グラム グラム g [ gram]
90 キロ「グラム」 キロ「グラム」 Kg [ kilogram]
91 トン トン Ton
92 けいさん 計算 Hitungan
93 たす 足す Tambah [ +]
94 ひく 引く Kurang [ - ]
95 かける 掛ける Kali [ x]
96 わる 割る Bagi [ :]
97 は「イコール」 は「イコール」 Sama dengan [ =]
98 せん 線 Garis
99 ちょくせん 直線 Garislurus
100 きょくせん 曲線 Garislengkung
101 てんせん 点線 Garistitik- titik
102 かたち 形 Bentuk
103 えん「まる」 円「丸」 Lingkaran
104 さんかく「けい」 三角「形」 Segitiga
105 しかく「けい」 四角「形」 Segiempat
106 もよう 模様 Pola
107 たてじま 縦縞 Garisvertical
108 よこじま 横縞 Garishorizontal
109 チェック チェック Kotak- kotak
110 みずたま 水玉 Polkadot
111 はながら 花柄 Motif bunga
112 むじ 無地 Polos
`;

function parseRaw(rawStr, babNum) {
  const lines = rawStr.split('\n').map(l => l.trim()).filter(l => l.length > 0 && /^\d+/.test(l));
  const results = [];
  for (const line of lines) {
    let fixed = line.replace(/j a/g, 'ja').replace(/f a/g, 'fa').replace(/j i/g, 'ji');
    const match = fixed.match(/^\d+\s+(.*?)\s+([\(\[].*|Memb.*|Teba.*|Tumb.*|Kura.*|Mati.*|Cera.*|Robo.*|Luka.*|Gram.*|Mm.*|Cm.*|Kilo.*|Leba.*|Seba.*|Berb.*|Sama.*|Ukur.*|Volume.*|Bagi.*|Kali.*|Tamba.*|Bentu.*|Hitun.*|Bera.*|Ton.*|Pola.*|Lit.*|Leba.*|Bes.*|Panj.*|Lomba.*|Res.*|Seda.*|Akh.*|Tid.*|Mak.*|Kur.*|Pil.*|Ser.*|Ban.*|Lim.*|Kar.*|Umb.*|Lem.*|Pro.*|Tah.*|Kac.*|Kal.*|Nor.*|Rum.*|Vit.*|Men.*|I k.*|Ter.*|Kera.*|Lun.*|~Elek.*|~Tel.*|Pab.*|Kes.*|Ken.*|Set.*|Akh.*|Lum.*|Sel.*|Mut.*|Pan.*|Bod.*|Den.*|~de.*|Yan.*|Cho.*|Pel.*|I st.*|Sed.*|Ren.*|~,.*|Tan.*|Kei.*|Ken.*|Sej .*|Aba.*|Jau.*|Kej.*|Ker.*|Kap.*|Ban.*|Ama.*|Lua.*|Bum.*|Wri.*|Hid.*|Cep.*|Ber.*|Tid.*|Mak.*|Kur.*|Pil.*|Ser.*|Ban.*|Lim.*|Kar.*|Umb.*|Lem.*|Pro.*|Tah.*|Kac.*|Kal.*|Nor.*|Rum.*|Vit.*|[A-Z].*)$/);
    if (match) {
        let jp_kanji = match[1];
        let translation = match[2];
        let jp = jp_kanji.split(/\s+/)[0];
        if (jp.includes('「') && !jp_kanji.startsWith(jp.split('「')[0] + ' ')) {
           jp = jp_kanji.split(' ')[0];
        }
        
        let parts = jp_kanji.split(/\s+/);
        if(parts.length >= 2) {
            jp = parts[0];
        }

        results.push({
            jp: jp,
            id_translation: translation,
            category: "MNN2_Bab" + babNum
        });
    } else {
        const p = fixed.split(/\s+/);
        const idx = p.shift();
        const tr = p.splice(p.length/2 + 1).join(' ');
        results.push({
            jp: p[0],
            id_translation: p.slice(1).join(' ') + ' ' + tr,
            category: "MNN2_Bab" + babNum
        });
    }
  }
  return results;
}

const vocab36 = parseRaw(raw36, 36);
const vocab37 = parseRaw(raw37, 37);
const vocab38 = parseRaw(raw38, 38);
const vocab39 = parseRaw(raw39, 39);
const vocab40 = parseRaw(raw40, 40);

const all = [...vocab36, ...vocab37, ...vocab38, ...vocab39, ...vocab40];
fs.writeFileSync('src/data/mnn2_bab36_40.json', JSON.stringify(all, null, 2));

console.log("Written to src/data/mnn2_bab36_40.json");
