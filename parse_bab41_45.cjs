const fs = require('fs');

const raw41 = `
1 いただきます 頂きます Menerima ( bahasa merendah dari もらう)
2 くださいます 下さいます Memberi [ bahasa merendah dari くれる]
3 やります やります Memberikan [ kepada bawahan, binatang/ tanaman]
5 よびます 呼びます Memanggil
6 とりかえます 取り替えます Mengganti, menukar
7 しんせつにします 親切にします Bersikap ramah
8 かわいい 可愛い Manis, cantik, lucu, imut
9 「お」いわい 「お」祝い Perayaan, hadiah
10 いわいます 祝います Merayakan
11 おいわいします お祝いします Merayakan
12 おとしだま お年玉 Angpao tahun baru
13 （お）みまい （お）見舞い Jengukan untuk orang sakit
14 きょうみ 興味 Minat, ketertarikan
15 じょうほう 情報 I nf ormasi
16 ぶんぽう 文法 Pola kalimat,tata bahasa
17 はつおん 発音 Ucapan,pelaf alan
18 さる 猿 Monyet
19 えさ 餌 Makanan hewan
20 おもちゃ 玩具 Mainan
21 えほん 絵本 Buku bergambar
22 えはがき 絵葉書 Kartu posbergambar
23 ドライバー ドライバー Obeng
24 ハンカチ ハンカチ Sapu tangan
25 くつした 靴下 Kaoskaki
26 くつひも 靴紐 Tali sepatu
27 てぶくろ 手袋 Sarung tangan
28 ゆびわ 指輪 Cincin
29 バッグ バッグ Tas
30 そふ 祖父 Kakek (sendiri)
31 そぼ 祖母 Nenek (sendiri)
32 まご 孫 Cucu
33 おじ 叔父 Paman (sendiri)
34 おじさん 叔父さん Paman (orang lain)
35 おば 叔母 Bibi (sendiri)
36 おばさん 叔母さん Bibi (orang lain)
37 おととし 一昨年 Dua tahun yang lalu
38 はあ はあ Ya, ya?
39 もうしわけありません 申し訳ありません Saya minta maaf
40 あずかります 預かります Menj agakan sesuatu (titipan)
41 せんじつ 先日 Beberapa hari yang lalu,tempo hari
42 たすかります 助かります Tertolong
43 むかしばなし 昔話 Dongeng, cerita zaman dahulu
44 ある～ ある～ Sesuatu～
45 おとこ 男 Laki- laki
46 こどもたち 子供達 Anak- anak
47 いじめます 苛めます Membully,menindas,menyiksa
48 かめ 亀 Kura- kura
49 たすけます 助けます Menolong
50 （お）しろ （お）城 Kastil, istana
51 「お」ひめさま 「お」姫様 Putri raj a,tuan putri
52 たのしく 楽しく Dengan gembira
53 くらします 暮らします Hidup (melewati hari- hari)
54 りく 陸 Daratan
55 すると すると Kemudian, lalu
56 けむり 煙 Asap
57 まっしろ（な） 真っ白（な） Putih sekali
58 まっくろ（な） 真っ黒（な） Hitam pekat
59 まっか（な） 真っ赤（な） Merah menyala
60 なかみ 中身 I si
61 べんりじょうほう 便利情報 I nf ormasi praktis
62 たくはいびんなら、ペンキンびん！ 宅配便なら、ペンキン便！ Untuk j asa antar barang,hubungi j asa penguin!
63 りょこうのにもつをいえからくうこうまではいたつします 旅行の荷物を家から空港まで配達します Melayani j asa antar bagasi darirumah sampai bandara
64 がくせいやたんしんしゃのちいさいひっこしをします 学生や単身者の小さい引っ越しをします Melayani pula j asa antaran untuk mahasiswa atau buj angan yang akan pindah rumah dengan j umlah barang yang sedikit
65 とまりませんか 止まりませんか Mari menginap
66 みんしゅくみうら 民宿三浦 Guest House “Miura”
67 やすい、しんせつ、かていてきなやど 安い, 親切、家庭的な宿 Guest House dengan harga murah, pelayanan ramah dan harga ber sahabat
68 こうみんかんからの 公民館からのお知らせ Pengumuman dari balai kota
69 げつようび： にほんりょうりこうしゅうかい 月曜日: 日本料理講習会 Senin: pelaj aran masak makanan j epang
70 かようび： いけばなスクール 火曜日： 生け花スクール Selasa: Kelasmerangkai bunga
71 すいようび： にほんごきょうしつ 水曜日： 日本語教室 Rabu: kelasbahasa j epang
72 まいつきだい 3にちようび： バザー 毎月第 3 日曜日： バザー Tiap hari minggu ke- 3 dalam sebulan: bazaar
73 レンタルサービス レンタルサービス Jasa Penyewaan Barang
74 なんでもかします 何でも貸します Menyewakan apa saj a! !
75 カラオケ カラオケ Karaoke
76 ビデオカメラ ビデオカメラ Kamera video
77 きもの 着物 Kimono
78 けいたいでんわ 携帯電話 Handphone
79 ベビーようひん ベビー用品 Peralatan bayi
80 レジャーようひん レジャー用品 Peralatan santai
81 りょこうようひん 旅行用品 Peralatan piknik
82 べんりや 便利屋 Jasa rupa- rupa
83 なんでもします！！ 何でもします！！ Melakukan pekerj aan apapun!!
84 いえのしゅうり、そうじ 家の修理、掃除 Perbaikan dan pembersihan rumah
85 あかちゃん、こどものせわ 赤ちゃん、子供の世話 Menj aga bayi atau anak- anak
86 いぬの さんぽ 犬の散歩 Membawa anj ing j alan- j alan
87 はなし あいて 話し相手 Jasa teman bicara
88 おてらで たいけんできます お寺で体験出来ます Anda dapat mencoba hal berikut di kuil kami
89 ぜんが できます 禅が出来ます Meditasi Zen
90 しょうじんりょうりがたべられます 精進料理が食べられます Makanan Vegetarian
`;

const raw42 = `
1 つつみます 包みます Membungkus, menutup
2 わかします 沸かします Mendidihkan
3 わきます 沸きます Mendidih
4 まぜます 混ぜます Mencampur
5 けいさんします 計算します Menghitung
6 あつい 厚い Tebal
7 うすい 薄い Tipis
8 べんごし 弁護士 Pengacara
9 おんがくか 音楽家 Pemusik,musisi
10 ふたり 二人 Berdua, dua orang
11 きょういく 教育 Pendidikan
12 れきし 歴史 Sej arah
13 ぶんか 文化 Kebudayaan
14 しゃかい 社会 Masyarakat
15 ほうりつ 法律 Hokum
16 せんそう 戦争 Perang
17 へいわ 平和 Damai,tenteram
18 もくてき 目的 Tuj uan,maksud
19 あんぜん（な） 安全（な） Keselamatan, keamanan
20 ろんぶん 論文 Tesis,skripsi
21 かんけい 関係 Hubungan, koneksi,relasi
22 やかん 薬缶 Ceret,teko
23 せんぬき 栓抜き Pembuka tutup botol
24 かんきり 缶切り Pembuka kaleng
25 かんづめ 缶詰 Makanan kaleng
26 ふろしき 風呂敷 Kain pembungkusbarang
27 そろばん 十露盤 Alat hitung sempoa
28 たいおんけい 体温計 Thermometer
29 げんりょう 原料 Bahan mentah alam
30 ざいりょう 材料 Bahan- bahan mentah (sayuran, kacang dll)
31 いし 石 Batu
32 ピラミッド ピラミッド Piramida
33 データ データ Data
34 ファイル ファイル File
35 ある～ ある～ Sesuatu～
36 いっしょうけんめい 一生懸命 Dengan sungguh- sunguh
37 なぜ 何故 Mengapa, kenapa
38 こくれん 国連 Negara kesatuan
39 エリーゼのために エリーゼの為に Untuk elize
40 ベートーベン ベートーベン Ludwig van Beethoven, composer j erman (1770-1827)
41 ポーランド ポーランド Polandia
42 ローン ローン Kredit
43 セット セット Set
44 あと あと Sisa
45 カップラーメン カップラーメン Mie instan gelas
46 インスタントラーメン インスタントラーメン Mie instan
47 なべ 鍋 Panic
48 どんぶり 丼 Mangkuk besar
49 しょくひん 食品 Makanan
50 ちょうさ 調査 Pemeriksaan, penyelidikan
51 カップ カップ Gelas
52 また また Dan
53 ～のかわりに ～の代わりに Pengganti～
54 どこでも 何処でも Dimanapun
55 いまでも 今でも Sekarangpun
56 じむようひん•どうぐ 事務用品・道具 Perlengkapan kantor dan alat- alat
57 とじる 綴じる Menj ilid
58 ホッチキス ホッチキス Hekter, staples
59 はさむ•とじる 挟む・綴じる menj epit
60 クリップ クリップ Klip
61 とめる 留める Menyemat
62 がびょう「おしピン」 画鋲「押しピン」 Paku payung
63 はる 張る menempelkan
64 セロテープ セロテープ Selotip
65 ガムテープ ガムテープ Selotip kertas
66 のり 糊 Lem
67 けずる 削る Meruncingkan
68 えんぴつけずり 鉛筆削り Peruncing pensil
69 ファイルする ファイルする Mengarsipkan
70 ファイル ファイル Arsip
71 けす 消す Menghapus
72 けしゴム 消しゴム Penghapus
73 しゅうえいえき 修正液 Tipe- Ex
74 「あなを」あける 「穴を」開ける Melubangi
75 パンチ パンチ Alat pelubang kertas
76 けいさんする 計算する Menghitung
77 でんたく 電卓 Kalkulator
78 「せんを」ひく•はかる 「線を」引く・測る Menggaris
79 じょうぎ「ものさし」 定規「物指」 Penggaris
80 きる 切る Memotong
81 のこぎり 鋸 Gergaj i
82 「くぎを」うつ 「釘を」打つ Memaku
83 かなづち 金槌 Palu
84 はさむ•まげる•きる 挟む・曲げる・きる Menj epit/ membengkokkan/ memotong
85 ペンチ ペンチ Tang
86 「ねじを」しめる 「螺子を」締める Mengencangkan [ sekrup]
87 「ねじを」ゆるめる 「螺子を」緩める Melonggarkan [ sekrup]
88 ドライバー ドライバー Obeng
`;

const raw43 = `
1 ふえます「ゆしゅつが～」 増えます「輸出が～」 [ Ekspor] Meningkat,bertambah
2 ふやします「ゆしゅつを～」 増やします「輸出を～」 Meningkatkan, menambah [ Ekspor]
3 へります「ゆしゅつが～」 減ります「輸出が～」 [ Ekspor] Berkurang,menurun
4 へらします「ゆしゅつを～」 減らします「輸出を～」 Mengurangi,menurunkan [ Ekspor]
5 あがります「ねだんが～」 上がります「値段が～」 [ Harganya] Naik
6 さがります「ねだんが～」 下がります「値段が～」 [ Harganya] Turun
7 きれます「ひもが～」 切れます「紐が～」 [ Talinya] Putus
8 とれます「ボタンが～」 取れます「ボタンが～」 [ Kancing] Lepas,copot
9 おちます「にもつが～」 落ちます「荷物が～」 [ Barang] Jatuh
10 おとします「にもつを～」 落とします「荷物を～」 Menj atuhkan [ Barang]
11 なくなります「ガソリンが～」 無くなります「ガソリンが～」 [ bensin/ bahan bakar] Habis/ hilang
12 じょうぶ（な） 丈夫（な） Kuat, sehat
13 へん（な） 変（な） Aneh
14 しあわせ（な） 幸せ（な） Bahagia
15 うまい 上手い Enak,terampil, j ago
16 まずい 不味い Tidak enak, menj ij ikkan
17 つまらない 詰らない Membosankan,tidak menarik
18 ガソリン ガソリン bensin/ bahan bakar
19 ひ 火 Api
20 だんぼう 暖房 Penghangan/ pemanasruangan
21 れいぼう 冷房 Pendingin ruangan [ AC]
22 センス センス Seler a ( 「ふくの」～があります： mempunyai seler a yang baik [ dalam pakaian] )
23 いまにも 今にも Sekarangpun [ dipakai untuk menj elaskan situasi sebelum bertukar]
24 わあ わあ Oh! / Wow! / Wah!
25 かいいん 会員 Anggota kongres
26 てきとう（な） 適当（な） Tepat, sesuai, layak
27 ねんれい 年齢 Umur, usia
28 しゅうにゅう 収入 Pendapatan
29 ぴったり ぴったり Pas sekali
30 そのうえ その上 Lagi pula
31 ～といいます ～と言います Bernama～
32 ばら バラ Mawar
33 ドライブ ドライブ Bepergian naik mobil
34 せいかく 性格 Kepribadian
35 せいじつ 性質 Sif at
36 あかるい 明るい Ceria
37 くらい 暗い Muram
38 やさしい 優しい Baik hati, ramah
39 おとなしい 大人しい Tenang, Pendiam, Patuh
40 つめたい 冷たい Kaku, Dingin
41 きびしい 厳しい Keras, Disiplin
42 きがながい 気が長い Penyabar
43 きがみじかい 気が短い Cepat marah, Tidak sabaran
44 きがつようい 気が強い Berkemauan keras
45 きがよわい きがよわい Penakut, berj iwa lemah
46 かつぱつ「な」 活発「な」 Aktif
47 せいじつ「な」 誠実「な」 Tulus
48 わがまま「な」 我が儘「な」 Egois
49 まじめ「な」 真面目「な」 Serius, sungguh- sungguh
50 ふまじめ「な」 不真面目「な」 Tidak serius
51 がんこ「な」 頑固「な」 Keraskepala
52 すなお「な」 素直「な」 Penurut, j uj ur
53 いじわる「な」 意地悪「な」 Jahat
54 かちき「な」 勝ち気「な」 Tidak mau kalah
55 しんけいしつ「な」 神経質「な」 Penggugup, mudah gelisah
`;

const raw44 = `
1 なきます 泣きます Menangis
2 わらいます 笑います Tertawa
3 かわきます 乾きます Kering
4 かわかします 乾かします Mengeringkan
5 ぬれます 濡れます Basah
6 ぬらします 濡らします Membasahi
7 すべります 滑ります Tergelincir, terpeleset
8 おきます「じこが～」 起きます「事故が～」 [ kecelakaan] Terj adi,timbul
9 ちょうせつします 調節します Mencocokkan
10 あんぜん（な） 安全（な） Aman
11 ていねい（な） 丁寧（な） Sopan, hati- hati, rapi
12 こまかい 細かい Kecil, receh
13 こい 濃い Kental,pekat,tua (warna)
14 うすい 薄い Encer, hambar (rasa), muda (warna)
15 くうき 空気 Udara
16 なみだ 涙 Air mata
17 わしょく 和食 Makanan Jepang
18 ようしょく 洋食 Makanan Barat
19 おかず 御数 Lauk- pauk
20 りょう 量 Jumlah,volume,kuantitas
21 ～ばい ～倍 ~kali
22 はんぶん 半分 Setengah,separo
23 シングル シングル Kamar untuk satu orang [ di hotel]
24 ツイン ツイン Kamar untuk dua orang [ di hotel]
25 たんす 箪笥 Lemari
26 せんたくもの 洗濯物 Cucian
27 りゆう 理由 Alasan
28 どうなさいますか どうなさいますか Anda mau bagaimana?
29 カット カット Potong
30 シャンプー シャンプー Shampo
31 どういうふうになさいますか どういう風になさいますか Bagaimana modalnya?/ Mau model apa?
32 ショート ショート Potong pendek
33 ～みたいにしてください ～みたいにしてください Tolong buat seperti ini～
34 これでよろしでしょうか これで宜しいでしょうか Begini cocok?
35 「どうも」おつかれさまでした 「どうも」お疲れ様でした Maaf , lama ya.
36 いやがります 嫌がります Merasa keberatan
37 また また Dan
38 じゅんじょ 順序 Urutan
39 ひょうげん 表現 Ungkapan, ekspresi
40 たとえば 例えば Contohnya, misalnya
41 わかれます 別れます Berpisah
42 えんぎがわるい 縁起が悪い Membawa sial
43 これら これら Kata- kata ini
44 びよういん 美容院 Salon
45 りはつてん 理髪店 Pangkas Rambut
46 カット カット Potong rambut
47 パーム パーム Keriting
48 セット セット Tata rambut (sanggul,dll)
49 シャンプー シャンプー Sampo
50 リンス リンス Conditioner
51 トリートメント トリートメント Perawatan rambut
52 ブロー ブロー Blow
53 ヘアダイ ヘアダイ Pewarna rambut
54 そります「ひげ/ かおを～」 剃ります「髭/ 顔を～」 Mencukur [ j enggot/kumis(muka)]
55 わける「かみを～」 分ける「髪を～」 Membelah [rambut]
56 ～きってください ～切ってください Tolong potong rambut saya
57 みみが みえるくらいに 耳が見えるくらいに Sampai telinga terlihat
58 かたに かかるくらいに 肩に掛かるくらいに Sebahu
59 まゆが かくれるくらいに 眉が隠れるくらいに Sebatas alis
60 1 センチぐらいに 1 センチくらいに Dengan j arak 1cm
61 このしゃしん みたいに この写真みたいに Sesuai f oto ini
62 いろいろなヘアスタイル 色々なヘアスタイル Macam- macam gaya rambut
63 ボブ ボブ Bob
64 レイヤーカット レイヤーカット Ditrap, dipotong trap
65 ソバージュ ソバージュ Keriting spir al
66 おかっぽ お闊歩 Bob lurus
67 みつあみ 三つ編み Kepang tiga
68 ポニーテール ポニーテール Buntut kuda
69 まるがり 丸刈り Cepak
70 ちょうはつ 長髪 Rambut panj ang
71 リーゼント リーゼント Potong j ambul gaya ElvisPresly
`;

const raw45 = `
1 あやまります 謝ります Meminta maaf
2 あいます「じこに～」 遭います「事故に～」 Mengalami (kej adian buruk) [ kecelakaan]
3 しんじます 信じます Percaya,mempercayai
4 よういします 用意します Mempersiapkan, menyiapkan
5 キャンセルする キャンセルする Membatalkan
6 うまくいきます 上手くいきます Berj alan lancer
7 ほしょうしょ 保証書 Garansi
8 りょうしゅうしょ 領収書 Kuitansi
9 おくりもの 贈り物 Hadiah [ ～をします: memberikan hadiah]
10 まちがいでんわ 間違い電話 Telepon salah sambung
11 キャンプ キャンプ Kemping, berkemah
12 かかり 係り Petugas, tugas
13 ちゅうし 中止 Membatalkan
14 てん 点 Skor, angka
15 レバー レバー Pengungkit, tuas
16 「～えん」さつ 「～円」札 Satuan lembar uang [ - yen]
17 ちゃんと ちゃんと Secara teratur
18 きゅうに 急に Mendadak,tiba- tiba
19 たのしみにしています 楽しみにしています Mengharapkan dengan gembira, akan senang sekali
20 いじょうです 以上です Sekian, selesai
21 かかりいん 係員 Petugas
22 コース コース Lintasan
23 スタート スタート Start
24 ～い ～位 Ranking ke ~
25 ゆうしょうします 優勝します Menj uarai
26 なやみ 悩み Kesusahan, kesulitan
27 なやみます 悩みます Mendapat kesulitan, keruwetan
28 めざまし「どけい」 目覚まし「時計」 Jam beker
29 ねむります 眠ります Tidur
30 めがさめます 目が覚めます Terbangun,tersadar
31 だいがくせい 大学生 Mahasiswa
32 かいとう 回答 Jawaban
33 なります 鳴ります Berbunyi
34 セットします セットします Menyetel
35 それでも それでも Meskipun demikian
36 ひじょうのばあい 非常の場合 Keadaan darurat
37 じしんのばあい 地震の場合 Saat terj adi gempa
38 そなえがたいせつ 備えが大切 Persiapan adalah hal yang terpenting
39 かぐが たおれないようにしておく 家具が倒れないようにしておく Aturlah agar perabotan tidak berj atuhan
40 しょうかきを そなえる•みずを たくわておく 消火器を備える・水を咥えておく Sediakan alat pemadam kebakaran dan siapkan air
41 ひじょうようもちだしぶくろを よういしておく 非常用持ち出し袋を用意しておく Siapkan tasuntuk perlengkapan yang dibutuhkan dalam keadaan darurat
42 ちいきの ひなんばしょを かくにんしておく 地域の避難場所を確認しておく Pastikan anda megetahui dimana letak tempat perlindungan bencana
43 かぞく、ちじん、ゆうじんと、もしものばあいのれんらくさきをきめておく 家族、知人、友人と、もしもの場合の連絡先をきめておく Tetapkan nama dan alamat keluarga dan kenalan yang harusdihubungi saat darurat
44 まんにち じしんがおきたばあい 万一地震が起きた場合 Saat terj adi gempa
45 すばやくひの しまつ 素早く火の始末 Cepat- cepat matikan api
46 とをあけて でぐちのかくほ 戸を開けて 出口の確保 Pastikan pintu terbuka dan ada j alan keluar
47 あわてて そとにとびださない 慌てて外に飛び出さない Tidak panik berebutan keluar
48 テーブルの したにもぐる テーブルの下に潜る Berlindung dibawah mej a
49 じしんが おさまったら 地震が収まったら Ketika gempa sudah berhenti
50 ただしい じょうほうをきく「やまくずれ、がけくずれ、つなみにちゅうい」 正しい情報を く 「山崩れ、崖崩れ、津波に注意」 Dapatkan berita yang akurat [ hati- hati terhadap tanah longsor atau badai tsunami]
51 ひなんするばあい 避難する場合 Ketika harusmengungsi
52 くるまを つかわず、かならず あるいて 車を使わず、必ず歩いて Jangan menggunakan mobil, pastikan bahwa anda berj alan kaki
53 たいふうのばあい 台風の場合 Jika terj adi topan
54 きしょう じょうほうをきく 気象 情報を く Mendengarkan prakiraan cuaca
55 いえの まわりのてんけん 家の 周りの 点検 Periksalah sekeliling rumah
56 ラジオの でんちのそなえを ラジオの電地の備えを Persiapkanlah baterai radio
57 みず、きんきゅうしょくひんの じゅんび 水、緊急食品の準備 Persiapkanlah air dan makanan untuk keadaaan darurat
`;


function parseRaw(rawStr, babNum) {
  const lines = rawStr.split('\n').map(l => l.trim()).filter(l => l.length > 0 && /^\d+/.test(l));
  const results = [];
  for (const line of lines) {
    let fixed = line.replace(/j a/g, 'ja').replace(/f a/g, 'fa').replace(/j i/g, 'ji').replace(/i n/g, 'in').replace(/f or/g, 'for');
    const match = fixed.match(/^\d+\s+(.*?)\s+([\(\[].*|Mene.*|Memb.*|Mema.*|Meng.*|Ber.*|Man.*|Pera.*|Mer.*|Ang.*|Jen.*|Min.*|I n.*|Pol.*|Uca.*|Mon.*|Mak.*|Mai.*|Buk.*|Kar.*|Obe.*|Sap.*|Kao.*|Tal.*|Sar.*|Cin.*|Tas.*|Kak.*|Nen.*|Cuc.*|Pam.*|Bib.*|Dua.*|Ya,.*|Say.*|Ter.*|Don.*|Ses.*|Lak.*|Ana.*|Kur.*|Kas.*|Put.*|Den.*|Hid.*|Dar.*|Kem.*|Asa.*|Put.*|Hit.*|Mer.*|I s.*|Unt.*|Tia.*|Jas.*|Men.*|Per.*|And.*|Med.*|Teb.*|Tip.*|Pen.*|Pem.*|Ber.*|Keb.*|Mas.*|Hok.*|Per.*|Dam.*|Tuj .*|Tes.*|Hub.*|Cer.*|Ala.*|The.*|Bah.*|Bat.*|Pir.*|Dat.*|Fil.*|Nig.*|Neg.*|Kre.*|Set.*|Sis.*|Mie.*|Pan.*|Dan.*|Dim.*|Sek.*|Hek.*|Kli.*|Lem.*|Tip.*|Kal.*|Pal.*|Tan.*|Men.*|Nai.*|Tur.*|Put.*|Lep.*|Jat.*|Men.*|Hab.*|Kua.*|Ane.*|Bah.*|Ena.*|Tid.*|Mem.*|ben.*|Api.*|Pen.*|Sel.*|Oh!.*|Ang.*|Tep.*|Umu.*|Pas.*|Lag.*|Ber.*|Maw.*|Bep.*|Kep.*|Sif .*|Cer.*|Mur.*|Bai.*|Ten.*|Kak.*|Ker.*|Pen.*|Cep.*|Ber.*|Akt.*|Tul.*|Ego.*|Ser.*|Tid.*|Ker.*|Pen.*|Jah.*|Tid.*|Pen.*|Men.*|Ter.*|Ker.*|Men.*|Bas.*|Mem.*|Ter.*|Ama.*|Sop.*|Kec.*|Ken.*|Enc.*|Uda.*|Air.*|Mak.*|Lau.*|Jum.*|~ka.*|Set.*|Kam.*|Lem.*|Cuc.*|Ala.*|And.*|Pot.*|Sha.*|Bag.*|Tol.*|Beg.*|Maa.*|Mer.*|Dan.*|Uru.*|Ung.*|Con.*|Ber.*|Mem.*|Kat.*|Sal.*|Pan.*|Pot.*|Ker.*|Tat.*|Sam.*|Con.*|Per.*|Blo.*|Pew.*|Men.*|Mem.*|Tol.*|Sam.*|Seb.*|Seb.*|Den.*|Ses.*|Mac.*|Bob.*|Dit.*|Ker.*|Bob.*|Kep.*|Bun.*|Cep.*|Ram.*|Pot.*|Mem.*|Men.*|Per.*|Mem.*|Gar.*|Kui.*|Had.*|Tel.*|Kem.*|Pet.*|Mem.*|Sko.*|Pen.*|Sat.*|Sec.*|Men.*|Men.*|Sek.*|Pet.*|Lin.*|Sta.*|Ran.*|Men.*|Kes.*|Men.*|Jam.*|Tid.*|Ter.*|Mah.*|Jaw.*|Ber.*|Men.*|Mes.*|Kea.*|Saa.*|Per.*|Atu.*|Sed.*|Sia.*|Pas.*|Tet.*|Saa.*|Cep.*|Pas.*|Tid.*|Ber.*|Ket.*|Dap.*|Ket.*|Jan.*|Jik.*|Men.*|Per.*|Per.*|Per.*|[A-Z].*)$/i);
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

const vocab41 = parseRaw(raw41, 41);
const vocab42 = parseRaw(raw42, 42);
const vocab43 = parseRaw(raw43, 43);
const vocab44 = parseRaw(raw44, 44);
const vocab45 = parseRaw(raw45, 45);

const all = [...vocab41, ...vocab42, ...vocab43, ...vocab44, ...vocab45];
fs.writeFileSync('src/data/mnn2_bab41_45.json', JSON.stringify(all, null, 2));

console.log("Written to src/data/mnn2_bab41_45.json");
