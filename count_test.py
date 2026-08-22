import re

raw_text = """
水道
すいどう (penyimpanan air)


食べます
たべます (makan)


食堂
しょくどう (kantin)


食事
しょくじ (makanan)


飲みます
のみます (minum)


飲み物
のみもの (minuman)


魚
さかな (ikan)


肉
にく (daging)


牛肉
ぎゅうにく (daging sapi)


豚肉
ぶたにく (daging babi)


好き（な）
すき（な）(suka)


家
いえ (rumah)


家族
かぞく (keluarga)


新しい
あたらしい (baru)


広い
ひろい (luas)


広場
ひろば (lapang luas)


古い
ふるい (tua)


上
うえ (atas)


上手（な）
じょうず（な）(pintar/ahli)


～以上
～いじょう (~tentunya)


下
した (bawah)


中
なか (didalam/ditengah)


中止
ちゅうし (pengehentian)


月
げつ (bulan)


～月
～がつ (~bulan)


今月
こんげつ (bulan ini)


正月
しょうがつ (bulan pertama)


火
か (api)


木
もく(kayu)


金
きん (emas)


お金
おかね (uang)


料金
りょうきん (ongkos)


土
ど (tanah)


～曜日
～ようび (~hari)


朝
あさ (pagi)


昼
ひる (siang)


夜
よる (malam)


～時
～じ (~jam)


時間
じかん (waktu)


時計
とけい (jam tangan)


～分
～ふん (menit)


自分
じぶん (diri sendiri)


分ける
わける (membagi)


～半
～はん (~setengah)


～枚
～まい (lembar)


読みます
よみます (membaca)


聞きます
ききます (mendengar)


見ます
みます(melihat)


友だち
ともだち (teman)


何
なに (apa)


～年
～ねん (~tahun)


去年
きょねん (tahun lalu)


来年
らいねん (tahun depan)


今年
ことし (tahun ini)


昨年
さくねん (tahun lalu)


毎年
まいとし (setiap tahun)


今日
きょう (hari ini)


今週
こんしゅう (minggu ini)


今度
こんど (kali ini)


今
いま (sekarang)


今月
こんげつ (bulan ini)


今年
ことし (tahun ini)


今週
こんしゅう (minggu ini)


来週
らいしゅう (minggu depan)


先週
せんしゅう (minggu lalu)


週末
しゅうまつ (akhir pekan)


今度
こんど (kali ini)


温度
おんど (suhu)


東
ひがし (timur)


東京
とうきょう (tokyo)


西
にし (barat)


南
みなみ (selatan)


北
きた (utara)


会社
かいしゃ (perusahaan)


会います
あいます (bertemu)


会計
かいけい (bendahara)


会場
かいじょう (tempat pertemuan)


会社
かいしゃ (perusahaan)


神社
じんじゃ(pintu kuil)


来ます
きます (datang)


来週
らいしゅう (minggu depan)


来年
らいねん (tahun depan)


行きます
いきます (pergi)


旅行します
りょこうします (bertamasya)


銀行
ぎんこう (bank)


持って行く
もっていく (pergi membawa)


乗ります
のります (naik (kendaraan))


大きい
おおきい (besar)


大学
だいがく (universitas)


大人
おとな (orang dewasa)


大切（な）
たいせつ（な）(penting)


大変（な）
たいへん（な）(sangat berat)


小さい
ちいさい (kecil)


高い
たかい (mahal)


高校
こうこう (SMA)


低い
ひくい(rendah)


後ろ
うしろ (dibelakang)


午後
ごご (siang)


横
よこ (samping)


入口
いりぐち (pintu masuk)


入ります
はいります (memasukkan)


記入する
きにゅうする (mengisi)


入れる
いれる (memasukkan)


入院する
にゅういんする (masuk rumah sakit)


入力する
にゅうりょくする (memasukkan data)


入口
入口 (iriguchi)


出口
でぐち (pintu keluar)


口
くち (mulut)


窓口
まどぐち (ventilasi)


出口
でぐち (pintu keluar)


出かける
でかける (pergi keluar)


出発する
しゅっぱつする (berangkat)


出す
だす (mengeluarkan)


～階
～かい (~lantai)


押す
おす (menekan)


引く
ひく(aksi terhadp benda)


安い
やすい (murah)


一
いち (satu)


二
に (dua)


三
さん (tiga)


四
よん (empat)


五
ご (lima)


六
ろく (enam)


七
なな (tujuh)


八
はち (delapan)


九
きゅう (sembilan)


十
じゅう (sepuluh)


百
ひゃく(seratus)


千
せん (seribu)


万
まん (sepuluh ribu)


～円
～えん (~yen)


休み
やすみ (istirahat)


映画
えいが (bioskop)


映画
えいが (bioskop)


計画
けいかく (rencana)


日本語
にほんご (bahasa jepang)


英語
えいご (bahasa inggris)


勉強します
べんきょうします (belajar)


勉強します
べんきょうします (belajar)


強い
つよい (kuat)


買います
かいます (membeli)


温泉
おんせん (onsen)


温度
おんど (suhu)


温泉
おんせん (onsen)


予定
よてい (rencana)


予約
よやく (reservasi)


予定
よてい (rencana)


指定席
していせき (tempat duduk yang dipesan)


設定する
せっていする (penyesuaian, pengaturan)


旅行します
りょこうします (bepergian)


旅館 (rumah penginapan model jepang)
りょかん


学生
がくせい (pelajar)


学校
がっこう (sekolah)


大学
だいがく (universitas)


留学する
りゅうがくする (belajar di luar negeri)


学生
がくせい (pelajar)


生活
せいかつ (kehidupan)


先生
せんせい (guru)


誕生日
たんじょうび (hari ulang tahun)


生まれる
うまれる (lahir)


生
なま (hidup)


生産する
せいさんする (menghasilkan, memproduksi)


学校
がっこう (sekolah)


高校
こうこう (SMA)


生活
せいかつ (kehidupan)


去年
きょねん (tahun lalu)


先週
せんしゅう (minggu lalu)


先生
せんせい (guru)


連絡先
れんらくさき (kontak alamat)


仕事
しごと (pekerjaan)


仕事
しごと (pekerjaan)


食事
しょくじ (makanan)


用事
ようじ (urusan, keperluan)


工事
こうじ (konstruksi)


元気（な）
げんき（な）(baik)


元気（な）
げんき（な) (baik)


天気
てんき (cuaca)


電気
でんき (listrik)


病気
びょうき (sakit)


忙しい
いそがしい (sibuk)


働く
はたらく (bekerja)


作る
つくる (membuat)


人
ひと (orang)


～人
～にん (~orang) jumlah


～人
～じん (~jin) asal negara/ asal daerah


大人
おとな (orang dewasa)


犬
いぬ (anjing)


家族
かぞく (keluarga)


夕方
ゆうがた (sore)


夕方
ゆうがた (sore)


調理方法
ちょうりほうほう (nyaman mendengarkan)


～方
～かた (~cara)


英語
えいご (bahasa inggris)


音楽
おんがく (musik)


音
おと (suara)


音楽
おんがく (musik)


楽しい
たのしい (menyenangkan)


習う
ならう (belajar)


練習
れんしゅう (latihan)


習慣
しゅうかん (kebiasaan)


話す
はなす (berbicara)


電話番号
でんわばんごう (nomor telepon)


季節
きせつ (musim)


季節
きせつ (musim)


春
はる (musim semi)


夏
なつ (musim panas)


秋
あき (musim gugur)


冬
ふゆ (musim dingin)


花
はな (bunga)


同じ
おなじ (sama/mirip)


暑い
あつい (panas)


寒い
さむい (dingin(udara))


天気
てんき (cuaca)


晴れ
はれ (cerah)


雨
あめ (hujan)


雪
ゆき (salju)


風
かぜ (angin)


台風
たいふう (angin topan)


昨日
きのう (kemarin)


昨年
さくねん (tahun lalu)


明日
あした (besok)


説明する
せつめいする (menjelaskan)


明るい
あかるい (terang)


毎日
まいにち (setiap hari)


毎年
まいとし (setiap tahun)


町
まち (kota)


店
みせ (toko)


～店
～てん (~toko)


店長
てんちょう (manajer toko)


店員
てんいん (karyawan toko)


食堂
しょくどう (kantin)


便利（な）
べんり（な）(praktis)


不便（な）
ふべん（な）(tidak praktis)


郵便局
ゆうびんきょく(kantor pos)


便利（な）
べんり（な）(praktis)


利用する
りようする (menggunakan)


不便（な）
ふべん（な）(tidak praktis)


静か（な）
しずか（な）(sepi)


有名（な）
ゆうめい（な）(terkenal)


多い
おおい (banyak)


少ない
すくない (sedikit (orang))


少し
すこし (sedikit)


遠い
とおい (jauh)


道
みち (jalan)


水道
すいどう (penampungan air)


道具
どうぐ (binatang)


公園
こうえん (taman)


公園
こうえん (taman)


動物園
どうぶつえん (kebun binatang)


銀行
ぎんこう (bank)


お寺
おてら (kuil)


神社
じんじゃ (pintu kuil)


右
みぎ (kanan)


左
ひだり (kiri)


近く
ちかく (dekat)


近所
きんじょ (tetangga)


最近
さいきん (akhir-akhir ini)


車
くるま (mobil)


電車
でんしゃ (kereta)


自転車
じてんしゃ (sepeda)


送る
おくる (mengirim)


時間
じかん (waktu)


場所
ばしょ (tempat)


広場
ひろば (lapang luas)


場合
ばあい (keadaan)


会場
かいじょう (tempat pertemuan)


場所
ばしょ (tempat)


住所
じゅうしょ (tempat tinggal, domisili)


近所
きんじょ (tetangga)


駅
えき (stasiun)


受付
うけつけ (resepsionis)


受付
うけつけ (resepsionis)


門
もん (gerbang(


電車
でんしゃ (kereta)


電気
でんき (listrik)


電話番号
でんわばんごう (nomor telepon)


待つ
まつ (menunggu)


止まる
とまる (berhenti)


中止
ちゅうし (penghentian)


禁止
きんし (larangan minuman keras)


着く
つく (tiba, jangkauan)


着る
きる (memakai(baju))


到着する
とうちゃくする (tiba)


急ぐ
いそぐ (bergegas)


急に
きゅうに (tiba-tiba)


博物館
はくぶつかん (museum)


博物館
はくぶつかん (museum)


動物園
どうぶつえん (kebun binatang)


飲み物
のみもの (minuman)


博物館
はくぶつかん (museum)


旅館
りょかん (penginapan model jepang)


図書館
としょかん (perpustakaan)


動物園
どうぶつえん (kebun binatang)


動く
うごく(bergerak)


運動する
うんどうする (berolahraga)


自動
じどう (otomatisasi)


試合
しあい (pertandingan)


試合
しあい (pertandingan)


都合
つごう (kenyamanan)


合格する
ごうかくする (lulus)


場合
ばあい (keadaan)


難しい
むずかしい (sulit)


登る
のぼる (mendaki)


練習
れんしゅう (latihan)


漢字
かんじ (kanji)


漢字
かんじ (kanji)


数字
すうじ (angka)


無料
むりょう (gratis)


無料
むりょう (gratis)


材料
ざいりょう (bahan)


料理
りょうり (masakan)


料金
りょうきん (ongkos)


言う
いう (mengatakan)


書く
かく (menulis)


教科書
きょうかしょ(buku sekolah)


図書館
としょかん (perpustakaan)


貸す
かす (meminjamkan)


教える
おしえる (mengajarkan)


教科書
きょうかしょ (buku sekolah)


教室
きょうしつ (kelas)


説明する
せつめいする (menjelaskan)


午前
ごぜん (pagi)


午後
ごご (siang)


教科書
きょうかしょ (buku sekolah)


教室
きょうしつ (kelas)


全部
ぜんぶ (semua)


全員
ぜんいん (seluruhnya (orang))


全部
ぜんぶ (semua)


～回
～かい (~kali)


参加する
さんかする (ikut serta)


参加する
さんかする (ikut serta)


用意する
よういする (mempersiapkan)


用事
ようじ (urusan, keperluan)


利用する
りようする (menggunakan)


用意する
よういする (mempersiapkan)


意味
いみ (artinya)


お茶
おちゃ (teh)


お酒
おさけ (minuman keras)


材料
ざいりょう (bahan)


野菜
やさい (sayuran)


野菜
やさい (sayuran)


牛肉
ぎゅうにく (daging sapi)


牛乳
ぎゅうにゅう (susu sapi)


豚肉
ぶたにく (daging babi)


皿
さら (piring)


売る
うる (menjual)


持って行く
もっていく (membawa pergi)


卵
たまご (telur)


料理
りょうり (masakan)


調理方法
ちょうりほうほう (nyaman mendengarkan)


理由
りゆう (alsan, logika)


お湯
おゆ (air panas)


調理方法
ちょうりほうほう (nyaman mendengarkan)


調べる
しらべる (memerikasa)


調理方法
ちょうりほうほう (nyaman mendengarkan)


味
あじ (rasa)


意味
いみ (artinya)


甘い
あまい (manis)


辛い
からい (pedas)


苦手（な）
にがて（な）(tidak suka)


苦労する
くろうする (gugup)


苦手（な）
にがて（な）(tidak suka)


手
て (tangan)


歌手
かしゅ (penyanyi)


上手（な）
じょうず（な）(pintar)


コピー機
こぴーき (printer)


数字
すうじ (angka)


机
つくえ (meja)


都合
つごう (kenyamanan)


悪い
わるい (jelek)


使う
つかう (menggunakan)


終わる
おわる (selesai)


お願いします
おねがいします (mohon bantuannya)


氏名
しめい (nama lengkap)


理由
りゆう (alsan, logika)


自由
じゆう (kebebasan)


連絡先
れんらくさき (kontak alamat)


連絡先
れんらくさき (kontak alamat)


別に
べつに ("tidak ada yang istimewa" atau "tidak masalah)


特別（な）
とくべつ（な）(khusus)


税別
ぜいべつ (pajak terpisah)


早く
はやく (cepat)


吸う
すう (menghisap)


取る
とる mengambil)


帰る
かえる (pulang)


伝える
つたえる (menceritakan)


熱
ねつ (demam)


薬
くすり (ksusuri)


病気
びょうき (sakit)


病院
びょういん (rumah sakit)


病院
びょういん (rumah sakit)


入院する
にゅういんする (masuk rumah sakit)


医者
いしゃ (dokter)


医者
いしゃ (dokter)


住所
じゅうしょ (tempat tinggal, domisili)


住む
すむ (tinggal)


～才
～さい (~umur)


痛い
いたい (sakit)


眠い
ねむい (mengantuk)


寝る
ねる (tidur)


記入する
きにゅうする (mengisi)


体
からだ (badan)


体験
たいけん (pengalaman)


顔
かお (wajah)


目
め (mata)


耳
みみ (telinga)


頭
あたま(kepala)


足
あし (kaki)


満足（な）
まんぞく（な） (puas)


起きる
おきる (bangun)


歩く
あるく (berjalan)


走る
はしる (berlari)


運動する
うんどうする (berolahraga)


運転
うんてん (menyetir)


兄
あに (kakak laki-laki)


お兄さん
おにいさん (kakak laki-laki)


姉
あね (kakak perempuan)


お姉さん
おねえさん (kakak perempuan)


弟
おとうと (adik laki-laki)


妹
いもうと (adik perempuan)


夫
おっと (suami)


妻
つま (istri)


両親
りょうしん (orang tua)


両親
りょうしん (orang tua)


親切（な）
しんせつ（な）(baik hati)


男の子
おとこのこ (anak laki-laki)


男性
だんせい (pria)


女の子
おんなのこ (anak perempuan)


女性
じょせい (wanita)


お祝い
おいわい (perayaan)


誕生日
たんじょうび (hari ulang tahun)


結婚
けっこん (menikah)


結婚
けっこん (menikah)


時計
とけい (jam tangan)


会計
かいけい (bendahara)


計画
けいかく (rencana)


幸せ（な）
しあわせ（な(bahagia)


思う
おもう (saya pikir)


選ぶ
えらぶ (memilih)


合格する
ごうかくする (lulus)


価格
かかく (harga)


山
やま (gunung)


川
かわ (sungai)


海
うみ (laut)


島
しま (pulau)


森
もり (mori)


客
きゃく(tamu)


観光地
かんこうち (tempat wisata, daerah pariwisata, tempat tamasya)


観光地
かんこうち (tempat wisata, daerah pariwisata, tempat tamasya)


光る
ひかる (cahaya)


観光地
かんこうち (tempat wisata, daerah pariwisata, tempat tamasya)


地震
じしん (gempa)


経験
けいけん (pengalaman)


経験
けいけん (pengalaman)


体験
たいけん (pengalaman)


写真
しゃしん (foto)


写真
しゃしん (foto)


歌
うた (lagu)


歌手
かしゅ (penyanyi)


長い
ながい (panjang)


店長
てんちょう (manajer toko)


短い
みじかい (pendek)


立つ
たつ (berdiri)


役に立つ
やくにたつ (membantu)


泣く
なく (menangis)


注文
ちゅうもん (memesan)


注文
ちゅうもん (memesan)


文化
ぶんか (budaya)


予約
よやく (Pemesanan tempat, pemesanan, reservasi, pesanan, buking


電話番号
でんわばんごう (nomor telepon)


電話番号
でんわばんごう (nomor telepon)


～様
～さま (~tuan)


ご飯
ごはん (nasi)


牛乳
ぎゅうにゅう (susu sapi)


禁煙
きんえん (larangan meroko)


禁止
きんし (Masa larangan minuman keras, larang, pemegatan)


禁煙
きんえん (larangan meroko)


自由
じゆう (kebebasan)


自然
しぜん (alam, kodrat, sifat dasar, alamiah)


自転車
じてんしゃ (kendaraan)


事故
じこ (kecelakaan)


自分
じぶん (diri sendiri)


自動
じどう (otomatisasi)


塩
しお (garam)


油
あぶら (minyak)


量
りょう (kuantitas, takaran, ukuran, berat)


～屋
～や (~atap, rumah, toko, agen, penjual)


満足（な）
まんぞく（な） (puas)


切る
きる (memotong)


親切（な）
しんせつ（な）(baik hati)


大切（な）
たいせつ（な）(penting)


焼く
やく (membakar, mendiang, panggang)


自然
しぜん (alam, kodrat, sifat dasar, alamiah)


交通
こうつう (komunikasi; mengangkut; lalu lintas; hubungan seksual)


国際交流
こくさいこうりゅう (pertukaran internasional)


交通
こうつう (komunikasi; mengangkut; lalu lintas; hubungan seksual)


普通
ふつう (menyeluruh, umum, kelaziman)


船
ふね (kapal laut)


自転車
じてんしゃ (kendaraan)


運転
うんてん (menyetir)


東京
とうきょう (toky)o


遊ぶ
あそぶ (bermain)


出発する
しゅっぱつする (berangkat)


事故
じこ (kecelakaan)


故障
こしょう (rusak mesin)


故障
こしょう (rusak mesin)


指定席
していせき (kursi yang dipesan)


指定席
していせき (kursi yang dipesan)


週末
しゅうまつ (akhir pekan)


絵
え (gambar)


空
そら (langit)


泳ぐ
およぐ (berenang)


到着する
とうちゃくする (tiba)


お知らせ
おしらせ (pengumuman)


工事
こうじ (konstruksi)


条件
じょうけん (syarat-syarat, kondisi, pengertian)


条件
じょうけん (syarat-syarat, kondisi, pengertian)


～以上
～いじょう (atau lebih, lebih dari, melebihi, lebih besar dari)


開く
ひらく (membuka)


開く
あく (membuka)


生産する
せいさんする (menghasilkan, memproduksi, menelorkan)


世界
せかい (dunia)


世界
せかい (dunia)


国際交流
こくさいこうりゅう (pertukaran internasional)


国際交流
こくさいこうりゅう (pertukaran internasional)


紙
かみ (kertas)


始まる
はじまる (mulai)


申し込む
もうしこむ (berlaku, menawarkan, mengajak)


申し込む
もうしこむ (berlaku, menawarkan, mengajak)


文化
ぶんか (budaya)


祭り
まつり (festival)


正月
しょうがつ (tahun baru, bulan januari)


～式
～しき (gaya, upacara, metode, bentuk, ekspresi)


米
こめ (beras)


特別（な）
とくべつ（な）(khusus)


特に
とくに (khususnya)


服
ふく (baju)


袋
ふくろ (karung, kantong, tas, kresek)


全員
ぜんいん (semua)


店員
てんいん (pelayan toko)


習慣
しゅうかん (kebiasaan)


慣れる
なれる (terbiasa)


普通
ふつう (menyeluruh, umum, kelaziman)


暗い
くらい (gelap)


怒る
おこる (marah, kesal, jengkel)


色
いろ (warna)


赤
あか (merah)


青
あお (biru)


黒
くろ (hitam)


白
しろ (putih)


女性
じょせい (wanita)


男性
だんせい (pria)


営業する
えいぎょうする (bisnis, manajemen, perdagangan)


営業する
えいぎょうする (bisnis, manajemen, perdagangan)


授業
じゅぎょう (kelas)


卒業する
そつぎょうする (kelulusan)


案内する
あんないする (memandu)


案内する
あんないする (memandu)


商品
しょうひん (komoditi, dagangan, barang perdagangan, barang-barang, mendagangkan, barang dagangan, jualan, komoditas)


商品
しょうひん (komoditi, dagangan, barang perdagangan, barang-barang, mendagangkan, barang dagangan, jualan, komoditas)


値段
ねだん (harga)


値段
ねだん (harga)


価格
かかく (harga)


消費税
しょうひぜい (cukai, pajak, tambah, pajak pertambahan nilai, mengenakan cukai, nilai)


消す
けす (menghapus)


消費税
しょうひぜい (cukai, pajak, tambah, pajak pertambahan nilai, mengenakan cukai, nilai)


消費税
しょうひぜい (cukai, pajak, tambah, pajak pertambahan nilai, mengenakan cukai, nilai)


税別
ぜいべつ (pajak terpisah)


重い
おもい (berat)


軽い
かるい (lampu; ecek-ecek; lebih kecil)


変わる
かわる (berubah, perubahan, berubah, beralih)


大変（な）
たいへん（な）(sangat, sangat berat, sangat sulit, sangat keras)


市
し (kota)


図書館
としょかん (perpustakaan)


道具
どうぐ (alat, instrumen, peralatan, perkakas)


～点
～てん (titik;tandai;titik;titik)


必要（な）
ひつよう（な）(keperluan, perlu, kebutuhan, memerlukan, seperlunya, keadaan terpaksa, kemestian, usah, perlunya)


必要（な）
ひつよう（な）(keperluan, perlu, kebutuhan, memerlukan, seperlunya, keadaan terpaksa, kemestian, usah, perlunya)


借りる
かりる (meminjam)


返す
かえす (kembali, mengembalikan, menyerahkan kembali)


閉まる
しまる (menutup)


外国
がいこく(asing)


外
そと (di luar)


情報
じょうほう (informasi; Intelijen (militer))


情報
じょうほう (informasi; Intelijen (militer))


相談
そうだん (rembuk, perundingan, perembukan, musyawarah, konsultasi)


相談
そうだん (rembuk, perundingan, perembukan, musyawarah, konsultasi)


質問
しつもん (pertanyaan)


質問
しつもん (pertanyaan)


問題
もんだい (masalah)


窓口
まどぐち (ventilasi)


郵便局
ゆうびんきょく(kantor pos)


郵便局
ゆうびんきょく (kantor pos)


洗う
あらう (mencuci)


入力する
にゅうりょくする (memasukkan, mengetik)


危険
きけん (bahaya, berbahaya, risiko)


危ない
あぶない (bahaya, berbahaya, ragu)


危険
きけん (bahaya, berbahaya, risiko)


～種類
～しゅるい (jenis)


～種類
～しゅるい (jenis)


捨てる
すてる (menghisap)


燃える
もえる (menggebu)


決める
きめる (memutuskan)


設定する
せっていする ( tataan, mengkonfigurasi)


地震
じしん (gempa)


台風
たいふう (topan)


声
こえ (suara)


心配（な）
しんぱい（な）(khawatir)


心配（な）
しんぱい（な）(khawatir)


集まる
あつまる (berkumpul, terkumpul)


募集
ぼしゅう (merekrut)


進む
すすむ (memperoleh kemajuan; maju; meningkatkan)


最近
さいきん (akhir-akhir ini)


授業
じゅぎょう (kelas)


問題
もんだい (masalah)


困る
こまる (berada dalam kesulitan)


違う
ちがう (berbeda,salah)


増える
ふえる (meningkatkan)


笑う
わらう (tertawa)


苦労する
くろうする (penderitaan)


希望
きぼう (harapan)


希望
きぼう (harapan)


募集
ぼしゅう (merekrut)


建てる
たてる (membangun, mendirikan)


続ける
つづける (melanjutkan)


考える
かんがえる (memikirkan)


役に立つ
やくにたつ (membantu, berguna)


卒業する
そつぎょうする (kelulusan)


留学する
りゅうがくする (belajar di luar negeri)
名前
なまえ (nama)


氏名
しめい (nama lengkap)


前
まえ (di depan)


午前
ごぜん ( pagi/AM)


国
くに (Negara)


国際交流
こくさいこうりゅう (pertukaran internasional)


外国
がいこく(orang asing)


私
わたし (saya)


父
ちち (ayah)


お父さん
おとうさん (ayah)


母
はは (ibu)


お母さん
おかあさん (ibu)


子ども
こども (anak)


男の子
おとこのこ (anak laki-laki)


女の子
おんなのこ(anak perempuan)


日本
にほん (jepang)


～曜日
～ようび (~hari)


～日
～にち (~hari)


今日
きょう (hari ini)


日本語
にほんご (bahasa jepang)


昨日
きのう (kemarin)


明日
あした (besok)


毎日
まいにち (setiap hari)


誕生日
たんじょうび (hari ulang tahun)


本
ほん (buku)


水
みず (air)


水
すい (air)
"""

vocab_list = []
lines = [l.strip() for l in raw_text.split('\n') if l.strip()]

i = 0
while i < len(lines):
    line1 = lines[i]
    if i + 1 < len(lines) and '(' in lines[i+1]:
        line2 = lines[i+1]
        kanji = line1
        parts = line2.split('(', 1)
        hiragana = parts[0].strip()
        meaning = parts[1].replace(')', '').strip()
        vocab_list.append({
            "jp": kanji,
            "romaji": hiragana,
            "id_translation": meaning,
            "category": "JFT_A2_1_50"
        })
        i += 2
    else:
        if i + 1 < len(lines) and not '(' in lines[i+1] and '(' in line1:
            parts = line1.split('(', 1)
            kanji = parts[0].strip()
            meaning = parts[1].replace(')', '').strip()
            hiragana = lines[i+1].strip()
            vocab_list.append({
                "jp": kanji,
                "romaji": hiragana,
                "id_translation": meaning,
                "category": "JFT_A2_1_50"
            })
            i += 2
        else:
            i += 1

print(f"Total raw items: {len(vocab_list)}")
