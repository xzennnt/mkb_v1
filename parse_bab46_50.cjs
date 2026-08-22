const fs = require('fs');

const raw46 = `
1. やきます 焼きます Membakar
2. わたします 渡します Menyerahkan
3. かえってきます 帰って来ます Pulang untuk kembali lagi
4. でます「バスが～」 出ます「バスが～」 Berangkat
5. るす 留守 Sedang tidak ada di rumah
6. たくはいびん 宅配便 Jasa pengantaran barang
7. げんいん 原因 Penyebab
8. ちゅうしゃ 注射 Suntikan
9. しょくよく 食欲 Naf su makan
10. パンフレット パンフレット Pamf let, brosur
11. ステレオ ステレオ Stereo
12. こちら こちら Sebelah sini
13. ～のところ ～の所 Sekitar～
14. ちょうど 丁度 Pas, tepat
15. たったいま たった今 Baru saj a [ digunakan untuk waktu lampau; menunj ukkan yang baru saj a terj adi]
16. いまいいでしょうか 今いいでしょうか Bolehkah saya berbicara sekarang?
17. ガスサビースセンター ガスサビースセンター Pusat pelayanan gas
18. ガスレンジ ガスレンジ Tungku gas
19. ぐあい 具合 Keadaan
20. どちらさまでしょうか どちら様でしょうか Anda siapa?
21. むかいます 向かいます Menuj u,menghadap
22. おまたせしましいた お待たせしました Maaf anda telah menunggu lama
23. ちしき 知識 Pengetahuan
24. ほうこ 宝庫 Perbendaharaan, brankas, khazanah
25. てにはいります「じょうほうが～」 手に入ります「情報が～」 Mendapatkan [ inf ormasi]
26. システム システム System
27. たとえば 例えば Contohnya, misalnya
28 キーワード キーワード Keyword [ kata kunci]
29. いちぶぶん 一部分 Satu bagian
30. にゅうりょくします 入力します Memasukkan
31. びょう 秒 Detik
32. でます「ほんが～」 出ます「本が～」 [ buku] Terbit,diterbitkan
33. かたかなごのルーツ 片仮名語のルーツ Asal kata “katakana”
34. たべもの•のみもの 食べ物・飲み物 * makanan dan miniman
35. ジャム ジャム Selai
36. ハム ハム Ham
37. クッキー クッキー Biskuit
38. チーズ チーズ Kej u
39. コロッケ コロッケ Kroket
40. オメレツ オメレツ Telur dadar
41. ピーマン ピーマン Paprika
42. フランクフルト「ソーセージ フランクフルト「ソーセージ Sosisfrankurt
43. ビール ビール Bir
44. コーヒー コーヒー Kopi
45. パン パン Roti
46. カステラ カステラ Sponge cake
47. マカロニ マカロニ Macaroni
48. スパゲッティ スパゲッティ Spaghetti
49. いふく 衣服 * Busana
50. エプロン エプロン Celemek
51. スカート スカート Rok
52. スーツ スーツ Setelan
53. ズボン ズボン Celana
54. ランジェリー ランジェリー Pakaian dalam wanita
55. キュロット キュロット Kulot
56. ズック ズック Sepatu karet
57. ホック ホック Kancing hak
58. ビロード ビロード Beludru
59. チョッキ チョッキ Rompi
60. びょうき 病気 * penyakit
61. インフルエンザ インフルエンザ I nf luenza
62. ストレス ストレス Str ess
63. レントゲン レントゲン Sinar rontgen
64. ノイローゼ ノイローゼ Sakit syaraf
65. アレルギー アレルギー Alergi
66. メス メス Pisau bedah
67. ピンセット ピンセット Pinset
68. げいじゅつ 芸術 *Seni
69. ドラマ ドラマ Drama
70. コーラス コーラス Paduan suara
71. メロディー メロディー Melodi
72. バレエ バレエ Balet
73. シャンソン シャンソン Lagu rakyat perancis
74. アトリエ アトリエ Studio
75. メルヘン メルヘン Cerita dongeng
76. オペラ オペラ Opera
77. バレリーナ バレリーナ Ballerina
78. そのた その他 * Lain- lain
79. スケジュール スケジュール Jadwal
80. ティッシュペーパー ティッシュペーパー Tissue
81. トラブル トラブル Kesulitan
82. レジャー レジャー Waktu santai
83. アンケート アンケート Angket
84. コンクール コンクール Konkurensi
85. ピエロ ピエロ Badut
86. アルバイト アルバイト Kerj a sambilan
87. エネルギー エネルギー Energy
88. ゲレンデ ゲレンデ Tempat bermain ski
89. テーマ テーマ Tema
90. ゴム ゴム Karet
91. ガラス ガラス Kaca
92. ペンキ ペンキ Cat
93. コック コック Koki
94. カルタ カルタ Kartu
`;

const raw47 = `
1. あつまります「ひとが～」 集まります「人が～」 [ Orang] Berkumpul
2. あつめます「ひとを～」 集めます「人を～」 Mengumpulkan [ Orang]
3. わかれます「ひとが～」 別れます「人が～」 [ Orang] Berpisah
4. ながいきします 長生きします Berumur panj ang
5. します「おと/ こえが～」「あじが～」「においが～」 します「音/ 声が～」「味が～」「匂いが～」 Terdengar [ bunyi/ suara] Terasa Tercium/ berbau
6. さします「かさを～」 差します「傘を～」 Membuka (payung)
7. ひどい 酷い Kej am,galak,tega, luar biasa
8. こわい 怖い Ngeri,takut
9. てんきよほう 天気予報 Prakiraan cuaca
10. はっぴょう 発表 Presentasi, pengumuman
11. じっけん 実験 Eksperimen, percobaan
12. じんこう 人口 Populasi,j umlah penduduk
13. におい 匂い Bau
14. かがく 科学 I lmu pengetahuan
15. いがく 医学 I lmu kedokteran
16. パトカー パトカー Mobil patroli
17. ぶんがく 文学 I lmu kesusastraan
18. きゅうきゅうしゃ 救急車 Ambulans
19. さんせい 賛成 Setuj u
20. はんたい 反対 Tidak setuj u/ pertentangan
21. だんせい 男性 Pria
22. じょせい 女性 Wanita
23. どうも どうも Kelihatannya [ digunakan ketika menyatakan prakiraan]
24. ～に よると ～に よると Menurut [ menyatakan sumber inf ormasi]
25. バリ「とう」 バリ「島」 Pulau Bali [ I ndonesia]
26. イラン イラン I ran
27. カリフォルニア カリフォルニア Calif ornia [ Amerika Serikat]
28. グアム グアム Guam
30. こいびと 恋人 Pacar
31. こんやくします 婚約します Bertunangan
32. あいて 相手 Pasangan, partner, lawan bicara
33. しりあいます 知り合います Saling mengenal
34. へいきんじゅみょう 平均寿命 Rata- rata usia lanj ut
35. くらべます 比べます Membandingkan
36. はかせ 博士 Doctor
37. のう 脳 Otak
38. けしょうひん 化粧品 Kosmetik
39. ホルモン ホルモン Hormon
40. しらべ 調べ Penelitian, pemeriksaan
41. けしょうします 化粧します Berdandan
42. けしょう 化粧 Dandanan
43. ぎおんご•ぎたいご 擬音語・擬態語 Onomatope
44. ザーザー「ふる」 ザーザー「降る」 [ huj an] lebat
45. ピューピュー「ふく」 ピューピュー「吹く」 [ angin] bertiup kencang
46. ゴロゴロ「なる」 ゴロゴロ「鳴る」 [ petir] menggelegar
47. ワンワン「ほえる」 ワンワン「吠える」 Guk! Guk!
48. ニャーニャー「なく」 ニャーニャー「鳴く」 Meong! Meong!
49. カーカー「なく」 カーカー「なく」 Gak! Gak!
50. げらげら「わらう」 げらげら「笑う」 [ tertawa] terbahak- bahak
51. しくしく「なく」 しくしく「泣く」 [ menagis] tersedu- sedu
52. きょろきょろ「みる」 きょろきょろ「見る」 [ menoleh] kanan kiri
53. ぱくぱく「たべる」 ぱくぱく「たべる」 [ makan] dengan lahap
54. ぐうぐう「ねる」 ぐうぐう「寝る」 [ tidur] nyenyak
55. すらすら「よむ」 すらすら「読む」 [ membaca] dengan lancer
56. ざらざら「している」 ざらざら「している」 [ terasa] kasar
57. べたべた「している」 べたべた「している」 [ terasa] lengket
58. つるつる「している」 つるつる「している」 [ terasa] licin
`;

const raw48 = `
1. おろします 降ろします・下ろします Menurunkan
2. とどけます 届けます Mengantar kan
3. せわします 世話します Mengurus,merawat
4. いや（な） 嫌（な） Tidak disukai,tidak diingini
5. きびしい 厳しい Disiplin, keras, ketat
6. じゅく 塾 Les, kur sus
7. スケジュール スケジュール Jadwal
8. せいと 生徒 Murid
9. もの 者 Orang (berhubungan relasi,keluarga,bawahan)
10. にゅうかん 入管 Kantor imigrasi
11. さいにゅうこくビザ 再入国ビザ Via masuk kembali ke suatu Negara
12. じゆうに 自由に Dengan bebas
13. ～かん ～間 Selama～ [ berhubungan dengan lamanya waktu]
14. いいことですね いい事ですね I tu hal yang baik ya
15. おいそがしいですか お忙しいですか Apakah anda sibuk? [ dipakai ketika bertanya kepada seseorang yang lebih tua atau senior]
16. ひさしぶり 久しぶり Sudah lama tidak bertemu
17. えいぎょう 営業 Bisnis,pemasaran
18. それまでに それまでに Sampai waktu itu
19. かまいません 構いません Tidak apa- apa/ Boleh
20. たのしみます 楽しみます Menikmati,bersenang- senang
21. もともと 元々 Dasarnya, awalnya
22. ～せいき ～世紀 Abad～
23. かわりします 代わりします Menggantikan
24. スピード スピード Kecepatan
25. きょうそうします 競争します Berlomba lari
26. サーカス サーカス Sirkus
27. げい 芸 Keahlian
28. うつくしい 美しい I ndah
29. すがた 姿 Penampakan,penampilan,wuj ud
30. こころ 心 Hati
31. とらえます 捉えます・捕らえます Berkesan, menangkap
32. ～にとって ～にとって Bagi
33. しつける 躾ける Melatih
34. きたえる 鍛える Melatih kedisiplinan
35. こどもに なにをさせますか 子供に何をさせますか Apa yang ingin anak anda lakukan?
36. しぜんの なかであそぶ 自然の中で遊ぶ Bermaian di alam bebas
37. スポーツをする スポーツをする Berolah raga
38. ひとりで りょこうする 一人で旅行する Melakukan perj alanan sendiri
39. いろいろな けいけんをする 色々な経験をする Membekali dengan beragam pengalaman
40. いいほんを たくさんよむ いい本を沢山読む Banyak membaca buku yang bermutu
41. おとしよりの はなしをきく お年寄りの話を聞く Mendengar kan cerita orang tua
42. ボランティアに さんかする ボランティアに参加する Mengikuti kegiatan sukarela
43. うちの しごとをてつだう 家の仕事を手伝う Membantu pekerj aan ornag tua
44. おとうとや いもうと、おじいちゃん、おばあちゃんの せわをする 弟や妹、お祖父ちゃん、お祖母ちゃんの世話をする Merawat adik, kakek, serta nenek
45. じぶんが やりたいことをやる 自分がやりたい事をやる Melakukan apa yang ingin dilakukan
46. じぶんのこと じぶんでけめる 自分の事自分で決める Mengambil keputusan ataspertimbanganya sendiri
47. じしんを もつ 自信を持つ Memiliki rasa kepercayaan diri
48. せきにんを もつ 責任を持つ Memiliki rasa tanggung j awab
49. がまんする 我慢する Bersabar
50. じゅくへ いく 塾へ行く Pergi belaj ar ke tempat bmbingan belaj ar
51. パアノやえいごをならう ピアノや英語を習う Belaj ar bermain piano, bahasa inggris, dll
`;

const raw49 = `
1. つとめます「かいしゃに～」 勤めます「会社に～」 Bekerj a [ untuk perusahaan]
2. やすみます 休みます Beristirahat
3. かけます「いすに～」0 掛けます「椅子に～」 Duduk [ di kursi]
4. すごします 過ごします Menghabiskan [ waktu]
5. よります「ぎんこうに～」 寄ります「銀行に～」 Mampir [ ke Bank]
6. いらっしゃいます いらっしゃいます Ada, pergi, datang ( bahasa hormat untuk います、いきます、きます)
7. めしあがります 召し上がります Makan, minum ( bahasa hormat untuk たべます、のみます)
8. おっしゃいます おっしゃいます Mengatakan ( bahasa hormat untuk いいます)
9. なさいます なさいます Melakukan ( kata hormat untuk します)
10. ごらんになります ご覧になります Melihat ( bahasa hormat untuk みます)
11. ごぞんじです ご存知です Mengetahui ( bahasa hormat untuk しっています)
12. あいさつ 挨拶 Salam
13. あいさつをします 挨拶をします Mengucapkan salam
14. はいざら 灰皿 Asbak
15. りょかん 旅館 Penginapan ala Jepang
16. かいじょう 会場 Tempat pertemuan
17. バスてい バス停 Halte bus
18. ぼうえき 貿易 Perdagangan
19. ～さま ～様 Kata hormat untuk さん
20. かえりに 帰りに Pada waktu pulang
21. たまに 偶に Kadang- kadang, sesekali
22. ちっとも ちっとも Sama sekali [ diikuti bentuk negative]
23. えんりょなく 遠慮なく Tanpa segan- segan/ malu- malu
24. ～ねん、～ぐみ ～年、～組 kelas～, ～
25. では では Kalau begitu [ kata hormat untuk じゃ]
26. だします「ねつを～」 出します「熱を～」 Demam
27. よろしく おつたえください よろしくお伝えください Tolong sampaikan salam saya
28. しつれいいたします 失礼いたします Permisi
29. ひまわり しょうがっこう 向日葵小学校 Nama SD [ hanya perumpamaan]
30. こうし 講師 Pembicara
31. おおくの～ 多くの～ banyak～
32. さくひん 作品 Hasil karya
33. じゅしょうします 受賞します Menerima hadiah
34. せかいてきに 世界的に Seluruh dunia
35. さっか 作家 Pengarang
36. ～でいらっしゃいます ～でいらっしゃいます Adalah [ kata hormat untuk です]
37. ちょうなん 長男 Anak laki- laki sulung
38. ちょうじょ 長女 Anak perempuan sulung
39. しょうがい 障害 Gangguan, rintangan, cacat
40. おもちです お持ちです Mempunyai ( bahasa hormat untuk もっています)
41. さっきょく 作曲 Komposisi/ aransemen lagu
42. かつどう 活動 Kegiatan, aktivitas
43. それでは それでは Baiklah [ menunj ukkan akhir atau awal]
44. おおえ けんざぶろう 大江 健三郎 Pengarang novel [ 1935- ]
45. とうきょう だいがく 東京大学 UniversitasTokyo
46. ノーベルぶんがくしょう ノーベル文学賞 Hadiah nobel untuk kesusastraan
47. でんわの かけかた 電話の掛け方 Cara menelepon
48. もしもし、＿＿さんのおたくで いらっしゃいますか もしもし、＿＿さんのお宅でいらっしゃいますか Hallo, apakah ini rumah_ _ _ ?
49. はい、＿＿でございます はい、＿＿でございます Ya, benar.
50. わたくし、＿＿ともうします 私、＿＿と申します Saya_ _ _ .
51. ＿＿さんはいらっしゃいますか ＿＿さんはいらっしゃいますか Apakah bisa bicara dengan _ _ _ ?
52. いいえ、ちがいます いいえ、違います Bukan, salah sambung.
53. あ、しつれいしました あ、失礼しました Maaf .
54. はい、ちょっと おまちください はい、ちょっと お待ちください Ya,baik. Tunggu sebentar
55. もしもし、＿＿ですが もしもし、＿＿ですが Hallo, ini_ _ _ .
56. ＿＿は がいしゅつちゅう ですが ＿＿は外出中ですが _ _ _ sedang keluar.
57. ああ、そうですか ああ、そうですか O,begitu, ya.
58. あのう、でんごんをおねがいできますか あのう、伝言をお願い出来ますか Apakah saya bisa titip pesan?
59. はい、どうぞ はい、どうぞ Ya, silahkan.
60. では、すみませんが、かいぎは 10 じに では、すみませんが、会議は 10 時に始めるとお伝えてください Kalau begitu, tolong beritahukan padanya bahwa rapat akan dimulai pukul 10.
61. はい、わかりました はい、分かりました Baik, akan saya sampaikan
62. ＿＿は でかけておりますが ＿＿は出かけておりますが _ _ _ sedang pergi.
63. なんじごろ おかえりになりますか 何時ごろお帰りになりますか Jam berapa beliau akan pulang?
64. 10 じごろに なるとおもいます 10 時ごろになると思います Sayakira dia akan kembali pukul 10.
65. では、そのごろ またおでんわします では、そのごろまたお電話します Kalau begitu, nanti saya akan telepon lagi sekitar pukul 10.
66. そうですか そうですか Baiklah.
67. しつれいします 失礼します Terima kasih.
`;

const raw50 = `
1. まいります 参ります Pergi,datang (bahasa merendahkan diri untuk いきます、きます)
2. おります 居ります Ada (bahasa merendah kan diri untuk います)
3. いただきます 頂きます Makan, minum, menerima ( bahasa merendah kan diri untuk たべます、のみます、もらいます)
4. もうします 申します Mengatakan (bahasa merendah kan diri untuk いいます)
5. いたします いたします Melakukan (bahasa merendah kan diri untuk します)
6. はいけんします 拝見します Melihat (bahasa merendah kan diri untuk みます)
7. ぞんじます 存じます Mengetahui (bahasa merendah kan diri untuk しります)
8. うかがいます 伺います Bertanya, mendengar, mengunj ungi (bahasa merendahkan diri untuk ききます、いきます)
9. おめにかかります お目にかかります Bertemu (bahasa merendahkan diri untuk あいます)
10. ございます ございます Ada ( kata hormat untuk あります)
11. ～でございます ～でございます Kata hormat untuk です
12. わたくし 私 Saya ( bahasa merendah わたし)
13. ガイド ガイド Pemandu, guide
14. おたく お宅 Rumah (orang lain)
15. こうがい 郊外 Pinggiran kota
16. アルバム アルバム Album
17. さらいしゅう 再来週 2 minggu yang akan datang
18. さらいげつ 再来月 2 bulan yang akan datang
19. さらいねん 再来年 2 tahun yang akan datang
20. はんとし 半年 Setengah tahun
21. さいしょに 最初に Awalnya,mula- mula
22. さいごに 最後に Terakhir
23. ただいま ただ今 Sekarang [ kata hormat untuk いま]
24. えどとうきょうはくぶつえん 江戸東京博物円 Museum Edo- Tokyo
25. きんちょうします 緊張します Gugup,grogi
26. ほうそうします 放送します Menyiar kan
27. とります「ビデオを～」 撮ります「ビデオを～」 Merekam [ video]
28. しょうきん 賞金 Uang hadiah
29. しぜん 自然 Alam
30. きりん 麒麟 Jerapah
31. ぞう 像 Gaj ah
32. ころ 頃 Masa
33. かないます「ゆめが～」 叶います「夢が～」 [ mimpi,khayalan] Terkabul, manj adi kenyataan
34. ひとことよろしいですか 一言宜しいですか Bolehkah saya menyampaikan sesuatu?
35. きょうりょくします 協力します Bekerj a sama
36. こころから 心から Setulusnya
37. かんしゃします 感謝します Berterima kasih
38. （お）れい （お）礼 Ucapan terima kasih
39. はいけい 拝啓 Dengan hormat
40. うつくしい 美しい I ndah
41. おげんきでいらっしゃいますか お元気で苛社いますか Apa kabar? [ kata hormat untuk げんきですか]
42. めいわくかけます 迷惑掛けます Merepotkan
43. いかします 生かします Memanf aatkan
44. 「お」しろ 「お」城 Kastil, I stana
45. けいぐ 敬具 Hormat saya
46. ムンチェン ムンチェン Munchen [ j erman]
47. ふうとう•はがきのあてなの かきかた 封筒・葉書の宛名の書き方 Cara menulisalamat di Amplop dan Kartu Pos
`;

function parseRaw(rawStr, babNum) {
  const lines = rawStr.split('\n').map(l => l.trim()).filter(l => l.length > 0 && /^\d+/.test(l));
  const results = [];
  for (const line of lines) {
    let fixed = line.replace(/j a/g, 'ja').replace(/f a/g, 'fa').replace(/j i/g, 'ji').replace(/i n/g, 'in').replace(/f or/g, 'for');
    
    // 1. Remove leading numbers like "1." or "1 "
    let withoutNum = fixed.replace(/^\d+\.?\s*/, '');
    
    // 2. Find where the translation starts
    let transMatch = withoutNum.match(/([A-Z\(\[\*\_].*)$/);
    
    let jp_kanji = withoutNum;
    let translation = "";
    
    if (transMatch) {
       jp_kanji = withoutNum.substring(0, transMatch.index).trim();
       translation = transMatch[1].trim();
    } else {
       // fallback for lines that might only be lowercase
       const p = withoutNum.split(/\s+/);
       if (p.length >= 2) {
           translation = p.splice(Math.floor(p.length/2)).join(' ');
           jp_kanji = p.join(' ');
       }
    }
    
    // 3. Extract just the jp part (usually before the space, handling quotation marks)
    let jp = jp_kanji.split(/\s+/)[0];
    if (jp.includes('「') && !jp_kanji.startsWith(jp.split('「')[0] + ' ')) {
       jp = jp_kanji.split(' ')[0];
    }
    let parts = jp_kanji.split(/\s+/);
    if(parts.length >= 2 && !jp_kanji.includes('「')) {
        jp = parts[0];
    }

    results.push({
        jp: jp,
        id_translation: translation,
        category: "MNN2_Bab" + babNum
    });
  }
  return results;
}

const vocab46 = parseRaw(raw46, 46);
const vocab47 = parseRaw(raw47, 47);
const vocab48 = parseRaw(raw48, 48);
const vocab49 = parseRaw(raw49, 49);
const vocab50 = parseRaw(raw50, 50);

const all = [...vocab46, ...vocab47, ...vocab48, ...vocab49, ...vocab50];
fs.writeFileSync('src/data/mnn2_bab46_50.json', JSON.stringify(all, null, 2));

console.log("Written to src/data/mnn2_bab46_50.json");
