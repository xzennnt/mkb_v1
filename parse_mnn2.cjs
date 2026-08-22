const fs = require('fs');

const rawText1 = `
# BAB 26 #
1. みます 見ます Melihat
2. みます
「いしゃに～」
診ます
「医者に～」
Memeriksa [ ke Dokter]
3. さがします 探します・捜します Mencari
4. おくれます
（じかん に ～）
遅れます
「時間に～」
Terlambat
5. まにあいます
（じかん に ～）
間に合います
「時間に～」
Tepat waktu
6. やります 遣ります Melakukan, mengerj akan
7. さんかします
（パーティー に～）
参加します
（パーティー に～）
Turut serta, ikut (dalam pesta)
8. もうしこみます 申し込みます Mendaf tar, melamar
9. つごうがいい 都合がいい Tidak ada halangan (waktu)
10. つごうがわるい 都合が悪い Berhalangan/ ada halangan ( waktu)
11. きぶんがいい 気分がいい Kondisi badan/ perasaan baik
12. きぶんがわるい 気分が悪い Tidak enak badan (waktu sakit)
13. しんぶんしゃ 新 社 Perusahaan surat kabar/ kantor surat kabar
14. じゅうどう 柔道 Judo (olahraga)
15. うんどうかい 運動会 Pesta olahraga
16. ばしょ 場所 Tempat
17. ボランティア ボランティア Volunteer, sukarelawan
18. ～べん ～弁 Logat,dialek
19. こんど 今度 Lain kali,berikutnya
20. ずいぶん 随分 Cukup (lebih dari perkiraan)
21. ちょくせつ 直接 Langsung
22. いつでも 何時でも Kapanpun
23. どこでも どこでも Dimanapun
24. だれでも 誰でも Siapapun
25. なんでも 何でも Apapun
26. こんな～ こんな～ ～Seperti ini
27. そんな～ そんな～ ～Seperti itu
28. あんな～ あんな～ ～Seperti yang disana
29. NHK NHK Nippon hoso kyoukai (perusahaan penyiaran) 
30. こども の ひ 子供の日 Hari anak- anak
31. エドヤストア エドヤストア Nama supermarket (hanya perumpamaan)
32. かたづきます
（にもつ が ～）
片付きます
（荷物 が～）
(barang- barang) Dibereskan,dirapikan
33. かたづけます
（にもつ を～）
片付けます
（荷物 を～）
Membereskan,merapikan(barang- barang)
34. ごみ 塵 Sampah
35. だします
（ごみ を～）
出します
（塵 を～）
Membuang (sampah)
36. もえます
（ごみ が～）
燃えます
（塵 が～）
(sampah)Terbakar/ dapat dibakar
37. げつ 。すい 。きん 月。水。きん Senin, rabu, j umat
38. おきば 置き場 Tempat pembuangan
39. よこ 横 Horizontal, sebelah, seder et
40. びん 瓶 Botol
41. かん 缶 Kaleng
42. （お）ゆ （お）湯 Air panas
43. ガス ガス Gas
44. ～がいしゃ ～会社 Perusahaan
45. れんらくします 連絡します Menghubungi
46. こまります 困ります Mendapat masalah
47. こまったなあ。 困ったなあ。 Payah ya. Gawat.
48. でんしメール 電子メール E- mail
49. うちゅう 宇宙 Luar angkasa
50. こわい 怖い Takut,ngeri
51. うちゅうせん 宇宙船 Pesawat luar angkasa
52. べつの 別の Yang lain
53. うちゅうひこうし 宇宙飛行士 Astronot
54. どい たかお 土井 隆雄 Takao Doi (astronot j epang)
55. ごみのだしかた 塵の出し方 Cara membuang sampah
56. ごみしゅうしゅうびの
おしらせ
塵収集日のお知らせ Pemberitahuan hari pembuangansampah
57. かねんごみ（もえるごみ 可燃塵（燃える塵 Sampah yang dapat dibakar
58. しゅうしゅうび： げつ、
すい、きんようび
収集日： 月、水、金曜日 Hari pengumpulan sampah: Senin,Rabu,Jumat 
59. かみくず 紙屑 Sampah kertas, misalnya:
kertaspembungkus, tissue, dll
60. なまごみ 生塵 Sampah dapur
61. ふねんごみ
（もえないごみ）
不燃塵（燃えない塵 Sampah yang Tidak Dapat Dibakar
62. しゅうしゅう： もうようび 収集： 木曜日 Hari pengumpulan sampah: Kamis
63. ガラスせいひん ガラス製品 Barang- arang yang terbuat dari kaca
64. プラスチックせいひん プラスチック製品 Barang- arang yang terbuat dari plastic
65. きんぞくせい だいどころ
ようひん
金属製 台所 用品 Barang- barang yang dipakai di dapur dan 
terbuat dari logam
66. そだいごみ 粗大塵 Sampah besar
67. しゅうしゅうび：
だい３かようび
収集日： 第３火曜日 hari pengumpulan sampah: Selasa, minggu ke- 3
68. かぐ 家具 Perabot rumah tangga
69. かてい でんか せいひん 家庭 電化 製品 Barang- barang elektronik rumah tangga
70. しげんごみ 資源塵 Sampah yang dapat didaur ulang
71. じてんしゃ 自転車 Sepeda
72. しゅうしゅうび： だい２、
だい４、かようび
収集日： 第２、第４、
火曜日
Hari pengumpulan sampah: Selasa,minggu
ke- 2 dan ke- 4
73. あきかん 空き缶 Kaleng bekas
74. あきびん 空き瓶 Botol bekas
75. ふるしんぶん 古新 Koran bekas 

# BAB 27 #
1. かいます 飼います Memelihara (binatang)
2. たてます 建てます Membangun, mendirikan
3. はしります（みち を～） 走ります（道を～） Berlari, berj alan (di j alan)
4. とります（やすみ を～） 取ります（休みを～） Mengambil (libur), cuti
5. みえます（やま が～） 見えます（山が～） Kelihatan, terlihat ( gunung)
6. きこえます（おと が～） こえます（音が～） Terdengar (suara)
7. できます
（くうこう が～）
出来ます（空港が～） (Bandara)Bisa,rampung, selesai, didirikan
8. ひらきます
（きょうしつ を～）
開きます（教室を～） Membuka(kursus)
9. ペット ペット Binatang peliharaan
10. とり 鳥 Burung
11. こえ 声 Suara
12. なみ 波 Ombak
13. はなび 花火 Kembang api
14. けしき 景色 Pemandangan
15. ひるま 昼間 Siang hari
16. むかし 昔 Masa lalu,dahulu kala
17. どうぐ 道具 Perkakas, alat
18. じどうはんばいき 自動販売機 Mesin penj ual otomatis
19. つうしんはんばい 通信販売 Penj ualan melalui pos
20. クリーニング クリーニング Pembersihan, pencucian
21. マンション マンション Kondominium, apartemen
22. だいどころ 台所 Dapur
23. ～きょうしつ ～教室 Kursus～
24. パーティールーム パーティールーム Tempat/ ruang untuk pesta
25. ～ご ～後 Sesudah/ setelah (diikuti waktu, j angka waktu)
26. ～しか ～しか Tidak ～lain selain (diikuti dengan 
bentuk negatif )
27. ほかの 他の Yang lain, lainnya
28. はっきり はっきり Dengan j elas
29. ほとんど 殆ど Hampir,hampir- hampir 
30. かんさいくうこう 関西空港 Bandara I nternasional Kansai
31. あきはばら 秋葉原 Nama daerah belanj a di Tokyo dimana 
ada banyak toko elektronik
32. いず 伊豆 Semenanj ung di pref ektur Shizuoka
33. にちょうだいく 日曜大工 Bertukang di hari minggu
34. ほんだな 本棚 Lemari/rak buku
35. ゆめ 夢 Mimpi, impian （～をみます: bermimpi ）
36. いつか 何時か Suatu hari nanti, kapan- kapan
37. いえ 家 Rumah
38. すばらしい 素晴らしい Sangat menarik, cemerlang, hebat
39. こどもたち 子供達 Anak- anak
40. だいすき（な） 大好き（な） Suka sekali,sangat suka
41. まんが 漫画 Komik, kartun
42. しゅじんこう 主人公 Peran utama,tokoh utama
43. かたち 形 Bentuk
44. ロボット ロボット Robot
45. ふしぎ（な） 不思議（な） Luar biasa, aneh
46. ポケット ポケット Kantong, saku
47. たとえば 例えば Misalnya, contohnya
48. つけます 付けます Menyematkan, memakai, memasang
49. じゆう（な） 自由（な） Bebas
50. じゆうに 自由に Dengan bebas
51. そら 空 Langit
52. とびます 飛びます Terbang
53. じぶん 自分 Diri sendiri
54. しょうらい 将来 Masa depan,hari depan
55. ドラえもん ドラえもん Nama peran dalam komik j epang
56. ちかくのみせ 近くの店 Toko di sekitar rumah
57. しゃしんや 写真屋 Tempat Cucu Cetak Foto
58. げんぞう 現像 Cuci film
59. プリント プリント Cetak
60. やきまし 焼き増し Cetak tambah
61. ひきのばし 引き伸ばし Cetak perbesar
62. ネガ ネガ Klise 
63. スライド スライド Slide
64. サービスサイズ サービスサイズ Ukuran servis
65. パノラマサイズ パノラマサイズ Ukuran panorama
66. クリーニングや クリーニング屋 Binatu
67. ドライクリーニング ドライクリーニング Dry- cleaning
68. みずあらい 水洗い Mencuci
69. しみぬき 染み抜き Menghilangkan noda
70. ぼうすいかこう 防水加工 Tahan air
71. サイズなおし サイズ直し Perbaikan ukuran
72. ちぢむ 縮む Menyusut
73. のびる 伸びる Melebar
74. コンビニ コンビニ Minimarket (yang buka 24 j am)
75. たくはいびんのうけつけ 宅配便の受付 Jasa pengantaran barang/ paket
76. しゃしんげんぞう 写真現像 Cuci- cetak f oto
77. こうきょう りょうきん
ふりこむ
公共料金振り込む Pembayaran rekening listrik, air ledeng,
telepon, tarif j asa- j asa pemerintah 
dll.
78. コピー、ファクス コピー、ファクス Fotokopi, f aks
79. はがき、きってのはんばい 葉書、切手の販売 Penj ualan kartu posdan perangko
80. コンサートチケットの
はんばい
コンサートチケットの
販売
Penj ualan tiket konser 

# BAB 28 #
1. うれます（パンが～） 売れます（パンが～） (Roti) Terj ual
2. おどります 踊ります Menari
3. かみます 噛みます Mengunyah ,mengggigit
4. えらびます 選びます Memilih
5. ちがいます 違います Berbeda
6. かよいます
（だいがくに～）
通います（大学に～） Pulang- pergi {(hadir setiap hari) ke Univer
sitas}
7. メモします メモします Membuat catatan
8. まじめ（な） 真面目（な） Raj in,tekun,sungguh- sungguh
9. ねっしん（な） 熱心（な） Tekun, antusias
10. やさしい 優しい Lemah lembut,baik hati
11. えらい 偉い Hebat, luar biasa
12. けいけん 経験 Pengalaman
13. しゅうかん 習慣 Kebiasaan
14. ちから 力 Kekuatan, tenaga
15. にんき 人気 Populer,terkenal
16. かたち 形 Bentuk
17. いろ 色 Warna
18. あじ 味 Rasa
19. ガム ガム Karet
20. しなもの 品物 Barang, komoditas
21. ねだん 値段 Harga
22. きゅうりょう 給料 Gaj i (konteksgaj i harian)
23. ボーナス ボーナス Bonus
24. ばんぐみ 番組 Acara, program
25. ドラマ ドラマ Drama
26. しょうせつ 小説 Novel
27. しょうせつか 小説家 Pengarang novel/ novelis
28. かしゅ 歌手 Penyanyi
29. かんりにん 管理人 Pengawas,penj aga
30. むすこ 息子 Putra (sendiri)
31. むすこさん 息子さん Putra (orang lain)
32. むすめ 娘 Putri (sendiri) 
33. むすめさん 娘さん Putri (orang lain)
34. じぶん 自分 Diri sendiri
35. しょうらい 将来 Masa depan,hari depan
36. しばらく 暫く Sementara,sementara waktu,sebentar
37. たいてい 大抵 Biasanya, kebanyakan
38. それに それに Dan lagi
39. それで それで Jadi, lalu
40. 「ちょっと」おねがいが
あります
「ちょっと」お願いが
あります
Saya ada (sedikit) permintaan. Saya harapkan 
bantuan anda
41. ホムーステイ ホムーステイ Homestay
42. かいわ 会話 Percakapan
43. しゃべります 喋ります Ngobrol
44. おしゃべりします お喋りします Ngobrol
45. おしらせ お知らせ Pengumuman
46. ひにち 日にち Tanggal
47. ど 土 Hari sabtu
48. たいいくかん 体育館 Gedung olahraga
49. むりょう 無料 Gratis
50. うちをかりる 家を借りる Penyewaan rumah
51. ちゅうおうせん 中央線 Nama j alur kereta listrik
52. にしおぎくぼえき 西荻窪駅 Stasiun Nishiogikuboeki
(Nama stasiun kereta listrik terdekat)
53. マンション マンション Kondominium {*アパト: apartemen,
* いっこだて（一戸建て）: rumah }
54. ちく３ねん 築３年 Didirikan 3 tahun yang lalu
55. やちん 家賃 Uang sewa
56. ほ５分 歩５分 5 menit berj alan kaki dari stasiun
57. しききん 敷金 Uang j aminan ( Uang yang dititipkan pada 
pemilik apartemen,dan dikembalikan 
sebagian saat penyewa akan pindah)
58. れいきん 礼金 Uang tanda terima kasih (uang yang diberikan 
kepada pemilik rumah)
59. かんりひ 管理費 Biaya perawatan
60. みなみむき 南向き Menghadap ke selatan
61. １０かいたての８かい １０階建ての８階 Di tingkat 8 dari 10 tingkat 
62. 2LDK ～ Rumah yang terdiri dari 2 kamar dan 1
ruangan yang sekaligus berf ungsi sebaai 
ruang
makan,ruang keluarga, dan ruang dapur
63. ６じょう ６畳 6 tatami ( 畳: ukuran yang digunakan untuk 
mengukur luasruangan j epang,{ 1 畳 = 1
lembar tatami ( 180cm X 90cm) }
64. やすいふどうさん やすい不動産 Nama agen perumahan 

# BAB 29 #
1. あきます「ドアが～」 開きます「ドアが～」 [ pintu] Terbuka
2. しまります「ドアが～」 閉まります「ドアが～」 [ pintu] Tertutup
3. つきます「でんきが～」 点きます「電気が～」 [ lampu] Nyala
4. きえます「でんきが～」 消えます「電気が～」 [ lampu] Mati,padam, lenyap
5. こみます「みちが～」 込みます「道が～」 [ Jalannya] Ramai,macet,padat,penuh sesak
6. すきます「みちが～」 空きます「道が～」 [ Jalannya] Sepi, kosong
7. こわれます「いすが～」 壊れます「椅子が～」 [ Kursi] Rusak
8. われます「コップが～」 割れます「コップが～」 [ Gelas] Pecah,retak
9. おれます「きが～」 折れます「木が～」 [ Pohon] Patah
10. やぶれます「かみが～」 破れます「紙が～」 [ Kertas] Sobek,robek
11. よごれます「ふくが～」 汚れます「服が～」 [ Baj u] Kotor
12. つきます
「ポケットが～」
付きます
「ポケットが～」
[ saku] Terdapat,dilengkapi
13. はずれます
「ボタンが～」
外れます
「ボタンが～」
[ Kancing] Terlepas,terbuka
14. とまります
「エレベーターが～」
止まります
「エレベーターが～」
[ Lif t] Berhenti
15. まちがえます 間違えます Berbuat salah, keliru
16. おとします 落とします Menj atuhkan, kehilangan
17. かかります「かぎが～」 掛かります「鍵が～」 Terkunci
18. （お）さら （お）皿 Piring
19. （お）ちゃわん （お）茶碗 Mangkuk
20. コップ コップ Gelas
21. ガラス ガラス Kaca
22. ふくろ 袋 Kantong
23. てぶくろ 手袋 Sarung tangan
24. さいふ 財布 Dompet
25. えだ 枝 Ranting, dahan
26. えきいん 駅員 Pegawai stasiun
27. このへん この辺 Sekitar sini
28. ～へん ～辺 Area, sekitar
29. このくらい このくらい Kira- kira sebesar ini
30. わすれもの 忘れ物 Barang terlupa, barang hilang
31. ～がわ ～側 Sebelah~ 
32. おさきにどうぞ お先にどうぞ Silahkan duluan
33. 「ああ。。」よかった 「ああ。。」良かった Syukurlah [ dipakai saat lega]
34. いまのでんしゃ 今の電車 Kereta api yang barusan
35. わすれもの 忘れ物 Barang yang ketinggalan
36. ～がわ ～側 Sebelah～
37. ポケット ポケット Saku
38. おぼえます 覚えます I ngat,menghaf al
39. おぼえていません 覚えていません Saya tidak ingat
40. あみだな 網棚 Rak j aring (rak kereta api)
41. たしか 確か Kalau tidak salah
42. よつや 四谷 Nama stasiun di j epang
43. じしん 地震 Gempa bumi
44. かべ 壁 Dinding
45. はり 針 Jarum
46. さします 指します Menunj ukkan
47. えきまえ 駅前 Depan stasiun
48. たおれます 倒れます Roboh,tumbang
49. にし 西 Barat
50. ひがし 東 Timur
51. みなみ 南 Selatan
52. きた 北 Utara
53. ほう 方 Arah
54. さんのみや 三宮 Nama tempat di Kobe
55. じょうたい 状態 Keadaan
56. ようす 様子 Penampilan
57. ふとっている 太っている Gemuk
58. やせている 痩せている Kurus
59. ふくらんでいる 膨らんでいる Gembung
60. あながはいっている 穴が入っている Berlubang
61. まがっている 曲がっている Bengkok
62. ゆがんでいる 歪んでいる Mencong
63 へこんでいる 凹んでいる Penyok
64. ねじれている 捩じれている Berbelit
65. かけている 欠けている Pecah pinggirnya 
66. ひびがはいっている 罅が入っている Retak
67. くさっている 腐っている Busuk
68. かわいている 乾いている Kering
69. ぬれている 濡れている Basah
70. こおっている 凍っている Beku 
`;

const rawText2 = `
# BAB 30 #
1. はります 貼ります Menempelkan
2. かけます 掛けます Menggantungkan
3. かざります 飾ります Menghias,mendekor
4. ならべます 並べます Menj aj arkan,menderetkan
5. うえます 植えます Menanam
6. もどします 戻します Mengembalikan
7. まとめます 纏めます Meringkas, menyusun
8. かたづけます 片付けます Membereskan,merapikan
9. しまいます 仕舞います Memasukkan, menyimpan
10. きめます 決めます Memutuskan, menentukan, menetapkan
11. しらせます 知らせます Memberitahukan
12. そうだんします 相談します Berunding, membicarakan
13. よしゅうします 予習します Mempersiapkan pelaj aran
14. ふくしゅうします 復習します Mengulang pelaj aran/ mereviewkembali
15. そのままにします その儘にします Membiarkan begitu saj a
16. おこさん お子さん Anak (orang lain)
17. じゅぎょう 授業 Pelaj aran
18. こうぎ 講義 Perkuliahan
19. ミーティング ミーティング Rapat, pertemuan
20. よてい 予定 Acara, rencana
21. おしらせ お知らせ Pengumuman, pemberitahuan
22. あんないしょ 案内書 Buku panduan
23. カレンダー カレンダー Kalender
24. ポスター ポスター Poster
25. ごみばこ 塵箱 Tempat sampah
26. にんぎょう 人形 Boneka
28. かびん 花瓶 Vasbunga
29. かがみ 鏡 Cermin
30. ひきだし 引き出し Laci
31. げんかん 玄関 Pintu masuk ala Jepang,ruang muka depan
32. ろうか 廊下 Lorong,koridor
33. かべ 壁 Dinding
34. いけ 池 Kolam 
35. こうばん 交番 Pospolisi
36. もとのところ 元の所 Tempat semula
37. まわり 周り Sekeliling, sekitar
38. まんなか 真ん中 Tengah- tengah,pusat
39. すみ 隅 Sudut,poj ok
40. まだ まだ Masih (diikuti bentuk positif )
41. ～ほど ～ほど Kira- kira
42. よていひょう 予定表 Daf tar/ rencana
43. ごくろうさま ご苦労様 Terima kasih ataskerj a kerasnya hari 
ini (ungkapan)
44. きぼう 希望 Keinginan, harapan, permohonan
45. なにか ごきぼうが
ありますか
何か ご希望が
ありますか
Apakah ada sesuatu keinginan?
46. ミュージカル ミュージカル Drama musik
47. それはいいですね それはいいですね I de yang baik ya.
48. ブロードウェイ ブロードウェイ Broadway
49. まるい 丸い Bulat
50. つき 月 Bulan
51. ある～ ある～ Pada suatu malam
52. ちきゅう 地球 Bumi
53. うれしい 嬉しい Senang,gembira
54. いや（な） 嫌（な） Tidak suka,tidak setuj u
55. すると すると Jadi, lalu
56. めざめます 目覚めます Terbangun, tersadar
57. めがさめる 目が覚める Terbangun, tersadar
58. いち 位置 Letak
59. （テレビの）よこ （テレビの）横 Disebelah (televisi)
60. うえから２だんめ 上から２段目 Ke- 2 dari atas
61. すみ 隅 Poj ok, sudut
62. おく 奥 Bagian dalam
63. てまえ 手前 Bagian depan
64. まえから２れつめ 前から２列目 Bariske- 2 dari depan
65. ななめまえ 斜め前 Samping depan
66. 「つくえの」まわり 「机の」周り Sekitar(mej a) 
67. 「きょうしつの」
まんなか
「教室の」真ん中 Di tengah- tengah (kelas)
68. ななめうしろ 斜め後ろ Samping belakang
69. 「ほんの」そば 「ほんの」側 Di samping (buku)
70. ２ぎょうめ ２行目 Bariske- 2
71. ４ページ ４ページ Halaman ke- 4
72. ３ぎょうめ ３行目 Bariske- 3 

# BAB 31 #
1. はじまります
「しきが～」
始まります
「式が～」
[ upacara] Mulai,dimulai
2. つづけます 続けます Meneruskan,melanj utkan
3. みつけます 見つけます Menemukan
4. うけます「しけんを～」 受けます「試験を～」 Menempuh,mengikuti (uj ian)
5. にゅうがくします 入学します Masuk (universitas)
6. そつぎょうします
「だいがくを～」
卒業します
「大学を～」
Lulus(dari universitas)
7. しゅっせきします
「かいぎに～」
出席します
「会議に～」
Menghadiri (rapat)
8. きゅうけいします 休憩します Beristirahat
9. れんきゅう 連休 Hari libur beruntun/ berurutan
10. さくぶん 作文 Karangan
11. てんらんかい 展覧会 Pameran
12. けっこんしき 結婚式 Upacara perkawinan
13. 「お」そうしき 「お」葬式 Upacara kematian
14. しき 式 Upacara
15. ほんしゃ 本社 Kantor pusat
16. してん 支店 Kantor cabang
17. きょうかい 協会 Gerej a
18. だいがくいん 大学院 Pasca sarj ana
19. どうぶつえん 動物園 Kebun binatang
20. おんせん 温泉 Sumber air panas,pemandian air panas
21. 「お」きゃく「さん」 「お」客「さん」 Tamu,pelanggan
22. だれか 誰か Seseorang,siapapun
23. ～の ほう ～の 方 (Tempat duduk) bagian
24. ずっと ずっと Terus- menerus
25. ピカソ ピカソ PabloPicasso, pelukisSpanyol (1881- 1973)
26. うえのこうえん 上野公園 Taman Ueno (di Tokyo)
27. のこります 残ります Tinggal, sisa
28. つきに 月に Sebulan
29. ふつう 普通 Umum,biasa
30. インターネット インターネット I nternet 
31. むら 村 Desa,kampong
32. えいがかん 映画館 Gedung bioskop
33. いや（な） 嫌（な） Tidak suka,tidak setuj u
34. そら 空 Langit
35. とじます 閉じます Menutup,memej amkan
36. とかい 都会 Kota
37. こどもたち 子供達 Anak- anak
38. じゆう 自由 Bebas
39. じゆうに 自由に Dengan bebas
40. せかいじゅう 世界中 Seluruh dunia
41. あつまります 集まります Berkumpul
42. うつくしい 美しい I ndah
43. しぜん 自然 Alam, alamiah
44. すばらしい 素晴らしい Bij ak, luar biasa
45. すばらしさ 素晴らしさ Kebaikan, Kebaj ikan
46. きがつきます 気が付きます Menyadari, ingat, merasa
47. せんもん 専門 Bidang Keilmuan, Keahlian
48. いがく 医学 Kedokteran
49. やくがく 薬学 Farmasi
50. かがく 科学 Kimia
51. せいかがく 生化学 Biokimia
52. せいぶつがく 生物学 Biologi
53. のうがく 農学 Pertanian
54. ちがく 地学 Geologi
55. ちりがく 地理学 Geograf i
56. すうがく 数学 Matematika
57. ぶつりがく 物理学 Fisika
58. こうがく 工学 Teknik
59. どぼくこうがく 土木工学 Teknik Sipil
60. でんしかがく 電子工学 Elektronika
61. でんきこうがく 電気工学 Teknik Listrik
62. きかいこうがく 機械工学 Teknik Mesin
63. コンピューターこうがく コンピューター工学 I nf ormatika
64. いでんしこうがく 遺伝子工学 Genetika
65. けんちくがく 建築学 Arsitektur 
66. てんもんがく 天文学 Astronomi
67. かんきょうかがく 環境科学 I lmu Tata Lingkungan
68. せいじがく 政治学 I llmu Politik
69. こくさいかんけいがく 国際関係学 Hubungan I nternasional
70. ほうりつがく 法律学 Hokum
71. けいざいがく 経済学 Ekonomi
72. けいえいがく 経営学 Manaj emen Bisnis
73. しゃかいがく 社会学 Sosiologi
74. きょういくがく 教育学 Kependidikan
75. ぶんがく 文学 Sastra
76. げんごがく 言語学 Linguistik
77. しんりがく 心理学 Psikologi
78. てつがく 哲学 Filsaf at
79. しゅうきょうがく 宗教学 Teologi
80. げいじゅつ 芸術 Seni
81. びじゅつ 美術 Seni Murni
82. おんがく 音楽 Seni Musik
83. たいいくがく 体育学 Pendidikan Jasmani 
`;

const rawText3 = `
# BAB 32 #
1. うんどうします 運動します Berolahraga
2. せいこうします 成功します Berhasil, sukses
3. しっぱいします
「しけんに～」
失敗します
「試験に～」
Gagal,mengalami kegagalan (dalam uj ian)
4. ごうかくします
「しけんに～」
合格します
「試験に～」
Lulus(uj ian)
5. もどります 戻ります Kembali
6. やみます「あめが～」 止みます「雨が～」 (huj an)Berhenti
7. はれます 晴れます Menj adi cerah
8. くもります 曇ります Menj adi mendung
9. ふきます「かぜが～」 吹きます「風が～」 Bertiup (angin)
10. なおります
「びょうきが～」
「こしょうが～」
直ります・治ります
「病気が～」
「故障が～」
Sembuh (dari
penyakit) ( Mesin)
diperbaiki
11. つづきます
「ねつが～」
続きます
「熱が～」
(demam yang tinggi) Berlanj ut,bersambung
12. かぜをひきます 風邪を引きます Masuk angin
13. ひやします 冷やします Mendinginkan
14. しんぱい（な） 心配（な） Mengkhawatir kan, khawatir
15. じゅうぶん（な） 十分（な） Cukup
16. やけど 焼けど Luka bakar ( ～を します: terbakar)
17. けが 怪我 Luka, cedera ( ～を します: terluka)
18. せき 咳 Batuk ( ～が でます)
19. インフルエンザ インフルエンザ I nf luenza
20. そら 空 Langit
21. たいよう 太陽 Matahari
22. ほし 星 Bintang
23. つき 月 Bulan
24. かぜ 風 Angin
25. すいどう 水道 Air ledeng
26. エンジン エンジン Mesin
27. チーム チーム Tim
28. こんや 今夜 Malam ini 
29. ゆうがた 夕方 Sore,senj a
30. まえ 前 Depan, sebelumnya
31. おそく 遅く Larut (malam)
32. こんなに こんなに Seperti ini
33. そんなに そんなに Seperti itu (tentang suatu hal/ barang yang 
berhubungan dengan lawan bicara)
34. あんなに あんなに Seperti itu (tentang suatu hal/ barang
yang tidak berhubungan baik dengan si
pembicara/ lawan bicara)
35. もしかしたら 若しかしたら Kemungkinannya
36. それは いけませんね。 それは 行けませんね。 Kasihan, ya. (Pada saat megucapkan rasa 
simpati)
37. オリンピック オリンピック Olimpiade
38. げんき（な） 元気（な） Sehat
39. い 胃 Lambung,perut
40. はたらきすぎ 働き過ぎ Terlalu banyak bekerj a
41. ストレス ストレス Stress
42. むりをします 無理をします Memaksakan diri
43. ゆっくりします ゆっくりします Beristirahat
44. ほしうらない 星占い Ramalan bintang
45. おうしざ 牡牛座 Bintang Taurus
46. たからくじ 宝くじ Lotre
47. あたります 当たります Menang [ lotre]
48 けんこう 健康 Kesehatan
49. れんあい 恋愛 Percintaan
50. こいびと 恋人 Pacar
51. 「お」かねもち 「お」金持ち Orang kaya
52. てんきよほう 天気予報 Prakiraan cuaca
53. はれ 晴れ Cerah
54. くもり 曇り Berawan
55. あめ 雨 Huj an
56. ゆき 雪 Salj u
57. はれのちくもり 晴れのち曇り Cerah, kemudian berawan
58. くもりときどき
「いちじ」あめ
曇り時々「一時」雨 Berawan, kadang- kadang turun huj an 
59. くもりところによって
あめ
曇り所によって雨 Berawan dan Huj an di beberapa tempat
60. こうすいかくりつ 降水確率 Kemungkinan Huj an
61. さいこうきおん 最高気温 Suhu Tertinggi
62. さいていきおん 最低気温ん Suhu Terendah
63. ほっかいどうちほう 北海道地方 Wilayah Hokkaidou
64. とうほくちほう 東北地方 Wilayah Touhoku
65. かんとうちほう 関東地方 Wilayah Kantou
66. ちゅうぶちいほう 中部地方 Wilayah Chubu
67. きんきちほう 近畿地方 Wilayah Kinki
68. しこくちほう 四国地方 Wilayah Shikoku
69. ちゅうごくちほう 中国地方 Wilayah Chuugoku
70. きゅうしゅうちほう 九州地方 Wilayah Kyuushuu
71. にわかあめ / ゆだち 俄雨 / 夕立 Hhuj an yang turun mendadak
72. かみなり 雷 Petir
73. たいふう 台風 Topan
74. にじ 虹 Pelangi
75. かぜ 風 Angin
76. くも 雲 Awan
77. しつど 湿度 Kelembaban
78. むしあつい 蒸し暑い Panas Lembab
79. さわやか「な」 爽やか「な」 Segar 

# BAB 33 #
1. にげます 逃げます Melarikan diri
2. さわぎます 騒ぎます Berbuat gaduh,berisik
3. あきらめます 諦めます Menyerah,putusasa
4. なげます 投げます Melempar
5. まもります 守ります Menj aga,mematuhi,melindungi
6. あげます 上げます Menaikkan
7. さげます 下げます Menurunkan
8. つたえます 伝えます Menyampaikan
9. ちゅういします
「くるまに～」
注意します
「車に～」
Memperhatikan (mobil)
10. はずします
「せきを～」
外します
「席を～」
Tidak ada (ditempat)
[ * Mengendurkan,melepaskan,menj auhkan diri]
11. だめ（な） 駄目（な） Jangan,tidak boleh
12. せき 席 Tempat duduk
13. ファイト ファイト Berj uang
14. マーク マーク Tanda
15. ボール ボール Bola
16. せんたくき 洗濯機 Mesin cuci
17. ～き ～機 Mesin
18. きそく 規則 Aturan, peraturan
19. しようきんし 使用禁止 Dilarang pakai
20. たちいりきんし 立入禁止 Dilarang masuk
21. いりぐち 入り口 Pintu masuk
22. でぐち 出口 Pintu keluar
23. ひじょうぐち 非常口 Pintu keluar darurat
24. むりょう 無料 Gratis
25. ほんじつ 本日 Hari ini
26. きゅうぎょう 休業 Tidak beroperasi (libur)
27. ほんじつきゅうぎょう 本日休業 Hari ini Tutup
28. えいぎょうちゅう 営業中 Sedang beroperasi (buka)
29. しようちゅう 使用中 Sedang dipakai
30. ～ちゅう ～中 Sedang, dalam
31. どういう どういう Apa～,bagaimana～ 
33. あと～ あと～ Tinggal～lagi
34. ちゅうしゃいはん 駐車違反 Pelanggaran parker
35. そりゃあ そりゃあ Hal itu
36. ～いない ～以内 Dalam~
37. けいさつ 警察 Polisi
38. ばっきん 罰金 Denda
39. でんぽう 電報 Telegram
40. ひとびと 人々 Orang- orang
41. きゅうよう 急用 Urusan/tugasmendadak
42. うちます
「でんぽうを～」
打ちます
「電報を～」
Mengirim (telegram)
43. でんぽうだい 電報代 Biaya telegram
44. できるだけ 出来るだけ Sebisa mungkin
45. みじかい 短い Pendek, singkat
46. みじかく 短く Dengan singkat
47. また また Dan
48. たとえば 例えば Misalnya, contohnya
49. きとく 危篤 Genting, kritis, koma
50. おもい 重い Berat, genting
51. びょうき 病気 Penyakit
52. おもいびょうき 重い病気 Sakit keras/parah
53. あす 明日 Besok
54. るす 留守 Tidak ada di rumah
55. るすばん 留守番 Penj aga rumah
56. 「お」いわい 「お」祝い Perayaan
57. なくなります 亡くなります Meninggal
58. かなしい 悲しい Sedih
59. かなしみます 悲しみます Sedih
60. かなしみ 悲しみ Kesedihan
61. りようします 利用します Memanf aatkan, menggunakan, memakai
62. ひょうしき 標識 Petunj uk
63. じゅんびちゅう 準備中 Dalam per siapan
32. もう もう (Tidak) ～lagi (diikuti bentuk negative) 
64. へいてん 閉店 Tutup
65. ていきゅうび 定休日 Hari Libur Tetap
66. けしょうしつ 化粧室 Kamara Kecil (untuk merias)
67. きねんせき 記念席 Tempat duduk bebasrokok
68. きつえんせき 喫煙席 Tempat duduk untuk merokok
69. よやくせき 予約席 Tempat duduk yang sudah dipesan
70. かきげんきん 火気厳禁 Mudah Terbakar
71. われものちゅうい 割れ物注意 Hati- hati barang pecah belah
72. うんてんしょうしんしゃ
ちゅうい
運転昇進者注意 Tanda bagi pengemudi yang baru 
mendapatkan SI M
73. こうじちゅう 工事中 Dalam perbaikan
74. えんそけいひょうはく
ざいふか
塩素系漂白剤不可 Jangan gunakan pemutih (chlorine)
75. てあらい 手新相 Cuci dengan tangan
76. アイロン「ていおん」 アイロン「低音」 Harusdisetrika (dengan suhu rendah)
77. ドライクリーニング ドライクリーニング Hanya untuk dry- cleaning 

# BAB 34 #
1. みがきます「はを～」 磨きます「歯を～」 Menggosok (gigi)
2. くみたてます 組み立てます Merakit
3. おります 折ります Melipat, mematahkan
4. きがつきます
「わすれものに～」
気が付きます
「忘れ物に～」
Menyadari, ingat, merasa
( barang yang tertinggal)
5. つけます
「しょうゆを～」
附けます
「醤油を～」
Membubuhi,mencelupkan
(kecap asin j epang)
5. みつかります
「かぎが～」
見つかります
「鍵が～」
(Kunci) Ketemu,diketemukan
6. します
「ネクタイを～」
します
「ネクタイを～」
Memakai (dasi)
7. しつもんします 質問します Bertanya
8. ほそい 細い Tipis
9. ふとい 太い Tebal
10. ぼんおどり 盆踊り Festival tarian Bon
11. ツポーツクラブ ツポーツクラブ Perkumpulan / klub olahraga
12. かぐ 家具 Perabot rumah tangga
13. キー キー Tombol j ari, Tuts
14. シートベルト シートベルト Sabuk pengaman
15. せつめいしょ 説明書 Buku petunj uk/ instruksi
16. ず 図 Gambar,denah
17. せん 線 Garis
18. やじるし 矢印 Tanda panah
19. くろ 黒 Hitam ( kata benda)
20. しろ 白 Putih (kata benda)
21. あか 赤 Merah (kata benda)
22. あお 青 Biru (kata benda)
23. こん 紺 Biru tua (kata benda)
24. きいろ 黄色 Kuning ( kata benda)
25. ちゃいろ 茶色 Coklat (kata benda)
26. しょうゆ 醤油 Kecap asin, shoyu
27. ソース ソース Saus
28. ～か～ ～か～ ～atau～ 
29. ゆうべ 夕べ Tadi malam
32. さっき 先 Tadi, Beberapa waktu yang lalu
33. さどう 茶道 Upacara minum Teh
34. おちゃをたてます お茶を点てます Membuat teh Jepang
35. さきに 先に Terlebih dahulu,duluan (Dipakai untuk 
mengatakan urutan perbuatan)
36. のせます 載せます Memuat, menaruh
37. これでいいですか。 これでいいですか。 I ni sudah benar kan?
(pada saat minta pertimbangan)
38. にがい 苦い Pahit
39. おやこどん 親子丼 Oyakodon
40. ざいりょう 材料 Bahan, material
41. ～ぶん ～分 Bagian, j atah (untuk kwalitas)
42. とりにく 鶏肉 Daging ayam
43. ～グラム ～グラム Gram
44. ～こ ～個 Satuan untuk benda kecil
45. たまねぎ 玉ねぎ Bawang bombai
46. ４ぶんの１ ４分の１ Satu per empat/ seper empat
48. なべ 鍋 Panci
49. ひ 火 Api
50. ひにかけます 火にかけます Meletakkan di atasapi
51. にます 煮ます Merebus
52. にえます 煮えます Matang (direbusmatang)
53. どんぶり 丼 Mangkuk besar
54. りょうり 料理 Masakan
55. やく 焼く Membakar, Memanggang
56. あげる 揚げる Menggoreng
57. いためる 炒める Menumis
58. ゆでる 茹でる Merebus(telur, kentang,dll)
59. むす 蒸す Mengukus
60. たく 炊く Menanak (nasi)
61. むく 剥く Megupas
62. きざむ 刻む Mencincang
63. かきまぜる かき混ぜる Megaduk
64. ちょうみりょう 調味料 Bumbu dapur/ masak 
65. しょうゆ 醤油 Kecap asin j epang
66. さとう 砂糖 Gula
67. しお 塩 Garam
68. す 酢 Cuka
69. みそ 味噌 Miso (tauco j epang)
70. あぶら 油 Minyak
71. ソース ソース Saus
72. マヨネース マヨネース Mayones
73. ケチャップ ケチャップ Saus tomat
74. からし「マスタード」 辛子「マスタード」 Mustard
75. こしょう 胡椒 Merica
76. とうがらし 唐辛子 Cabe Merah
77. しょうが「ジンジャー」 生姜「ジンジャー」 Jahe
78. わさび 山葵 Wasabi (lobak hij au j epang)
79. カレーこ カレー粉 Tepung kari
80. だいどころようひん 台所用品 Perabot Dapur
81. なべ 鍋 Panci
82. やかん 薬缶 Ceret, teko
83. おたま お玉 Tutup gelas, Panci, dll
84. ふた 蓋 Sendok Sayur
85. まないた 俎板 Talenan
86. ほうちょう 包丁 Pisau Dapur
87. ふきん 布巾 Kain Lap Dapur
88. フライパン フライパン Waj an
89. でんしオーブンレンジ 電子オーブンレンジ Oven Microwave
90. すいはんき 炊飯器 Rice Cooker
91. しゃもじ 杓文字 Sendok Nasi
92. かんきり 缶切り Pembuka Kaleng
93. せんぬき 栓抜き Pembuka Botol
94. ざる 笊 Saringan Bambu
95. ポット ポット Termos
96. ガスだい ガス台 Kompor Gas
97. ながし「だい」 流し「台」 Bak untuk cuci piring
98. かんきせん 換気扇 Kipas Ventilasi 

# BAB 35 #
1. さきます「はなが～」 咲きます「花が～」 [ Bunga] Mekar
2. かわります「いろが～」 変わります「色が～」 [ Warna] Berganti, berubah
3. こまります 困ります Mendapat masalah/ kesulitan
4. つけます「まるを～」 付けます「丸を～」 Memberi tanda [ lingkaran]
5. ひろいます 拾います Memungut, mengambil
6. かかります
「でんわが～」
掛かります
「電話が～」
Ada [ telepon]
7. らく（な） 楽（な） Mudah,ringan, gampang
8. ただしい 正しい Betul, benar
9. めずらしい 珍しい Aneh, langka
10. かた 方 Orang ( versi sopan dari ひと)
11. むこう 向こう Seberang sana, sebelah sana
12. しま 島 Pulau
13. むら 村 Kampung, desa
14. みなと 港 Pelabuhan
15. きんじょ 近所 Tetangga, ~terdekat
16. おくじょう 屋上 Atap, lantai puncak
17. かいがい 海外 Luar negeri
18. やまのぼり 山登り Pendakian gunung
19. ハイキング ハイキング Hiking, piknik
20. きかい 機会 Kesempatan
21. きょか 許可 I zin
22. まる 丸 Bulat
23. そうさ 操作 Pengoperasian
24. ほうほう 方法 Cara, langkah,metode
25. せつび 設備 Peralatan, f asilitas
26. カーテン カーテン Korden
27. ひも 紐 Tali
28. ふた 蓋 Tutup,penutup
29. は 葉 Daun
30. きょく 曲 Lagu,music
31. たのしみ 楽しみ Kesenangan
32. もっと もっと Lebih 
33. はじめに 初めに Awal,mula- mula,pertama- tama
34. これでおわります これで終わります Kita akhiri sampai disini, Sekian dulu
35. はこね 箱根 Tempat beristirahat di Pref ektur Kanagawa
36. にっこう 日光 Tempat wisata di Pref ektur Tochigi
37. はくば 白馬 Tempat beristirahat di Pref ektur Nagano
38. アフリカ アフリカ Afrika
39. それなら それなら Kalau begitu
40. やこうバス 夜行バス Bismalam
41. りょこうしゃ 旅行者 Agen perj alanan
42. くわしい 詳しい Terperinci, detil
43. スキーじょう スキー場 Tempat bermain ski
44. くさつ 草津 Tempat untuk beristirahat di Pref ektur Gunma
45. しがこうげん 志賀高原 Taman Nasional
46. しゅ 朱 Warna Merah terang
47. まじわります 交わります Bergaul
48. なかよくします 仲良くします Berteman akrab, hidup rukun
49. ひつよう（な） 必要（な） Perlu
50. ことわざ 諺 Peribahasa
51. すめばみやこ 住めば都 Dimana bumi dipij ak,disitu langit dij unj ung.
Dimanapun kita berada.j ika kita lama tinggal 
disana, kita akan merasa bahwa tempat itu
adalah tempat yang paling menyenangkan.
52. さんにんよればもんじゅ
ちえ
三人寄れば文殊の知恵 Dua kepala lebih baik daripada satu.
Pemikiran dari banyak orang lebih 
baik daripada pemikiran dari satu
orng saj a.
53. たてばしゃくやく、
すわればぼたん、あるく
すがたはゆりのはな
立てばしゃくやく、座れば
ぼたん、歩く姿はゆりの花
Senyummu bak mawar merekah, dagunya
bak lebah bergantung, dan suar anya 
merdu bak buluh perindu.
Perumpamaan terhadap seor ang
gadiscantik, j ika ia ber diri langkahnya
bagai bunga rumput,
j ika ia duduk eloknya bagai bunga peony, j ika 
ia berj alan indahnya bagai bunga lili.
54. ちりも つもれば やまと
なる
塵も積もれば山となる Sedikit demi sedikit lama- lama menj adio bukit.
Benda/ hal sekecil apapun j ika 
dikumpulkan sedikit demi sedikit akan 
menj adi banyak. 
55. うわさをすればかげ 噂をすれば影 Panj ang umur.
Perumpamaan terhadap orang yang sering
kali muncul j ika ia sedang dibicarakan.
56. はなよりだんご 花より団子 Leih baik kue daripada bunga.
Kualitaslebih baik daripada penampilan.
57. てんせきこけを
しょうぜず
転石苔を生ぜず Lumut tidak akan tumbuh kalau batu
berguling.
Memiliki 2 arti:
① Orang yang selalu aktif akan maj u.
② Orsng yang suka berpindah pekerj aan 
atau rumah tidak akan memperoleh
kesuksesan. 
`;

const allText = rawText1 + "\n" + rawText2 + "\n" + rawText3;
const lines = allText.split('\n');

const result = [];
let currentCategory = "";

let currentItem = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const babMatch = line.match(/^# BAB (\d+) #/);
  if (babMatch) {
    if (currentItem) result.push(currentItem);
    currentItem = null;
    currentCategory = "MNN2_Bab" + babMatch[1];
    continue;
  }
  
  const match = line.match(/^(\d+)[.]?\s+(.+)$/);
  if (match) {
    if (currentItem) result.push(currentItem);
    currentItem = {
        number: match[1],
        text: match[2],
        category: currentCategory
    };
  } else {
    if (currentItem) {
        currentItem.text += " " + line;
    }
  }
}
if (currentItem) result.push(currentItem);

const finalResult = [];

for (const item of result) {
  const parts = item.text.split(/\s+/);
  
  let transStartIndex = -1;
  for (let i = 1; i < parts.length; i++) {
    // If it contains a letter and isn't purely Japanese
    if (/[a-zA-Z]/.test(parts[i]) && !/[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/.test(parts[i])) {
      transStartIndex = i;
      break;
    }
  }
  
  // Hardcoded fixes for edge cases where translation includes numbers or symbols early on
  if (transStartIndex === -1) {
    transStartIndex = Math.floor(parts.length / 2);
  }
  
  let kana = parts[0];
  let kanji = "";
  if (transStartIndex > 1) {
    kanji = parts.slice(1, transStartIndex).join(" ");
  }
  
  let translation = parts.slice(transStartIndex).join(" ");
  
  let finalJp = kanji && kanji !== kana ? kanji + (kana && kana !== kanji ? ` (${kana})` : '') : kana;
  if (!kanji && kana) finalJp = kana;
  
  // Clean up parenthesis
  finalJp = finalJp.replace(/\\s+/g, ' ').trim();
  
  finalResult.push({
    jp: finalJp,
    id_translation: translation,
    category: item.category
  });
}

// Group
const grouped = {};
for (const item of finalResult) {
  if (!grouped[item.category]) grouped[item.category] = [];
  grouped[item.category].push({ jp: item.jp, id_translation: item.id_translation, category: item.category });
}

fs.writeFileSync('src/data/mnn2_bab26_30.json', JSON.stringify([
  ...(grouped["MNN2_Bab26"] || []),
  ...(grouped["MNN2_Bab27"] || []),
  ...(grouped["MNN2_Bab28"] || []),
  ...(grouped["MNN2_Bab29"] || []),
  ...(grouped["MNN2_Bab30"] || []),
], null, 2));

fs.writeFileSync('src/data/mnn2_bab31_35.json', JSON.stringify([
  ...(grouped["MNN2_Bab31"] || []),
  ...(grouped["MNN2_Bab32"] || []),
  ...(grouped["MNN2_Bab33"] || []),
  ...(grouped["MNN2_Bab34"] || []),
  ...(grouped["MNN2_Bab35"] || []),
], null, 2));

console.log('Saved MNN2 JSON files.');
