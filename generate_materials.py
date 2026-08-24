import re
import json

def parse_verbs():
    raw = """
1 あいます Bertemu 41 おろします Menurunkan 81 しょうかいします Mengenalkan 121 はなします Berbicara 161 わたります Menyebrang
2 あそびます Bermain 42 おこないます Mengadakan 82 すすめます Maju 122 はいります Masuk 162 わかります Mengerti
3 あびます　＊ Mandi 43 けします menghapus 83 さんぽします Jalan-jalan 123 はじまります Memulai 163 よみます Membaca
4 あつめます Mengumpulkan 44 かえします Mengembalikan 84 すきます Lapar 124 はじめます Mulai 164 よびます Memanggil
5 あります Ada (benda) 45 かえります Pulang 85 そうじします Membersihkan 125 はこびます Mengangkut 165 やみます Berhenti (hujan )
6 あるきます Jalan kaki 46 かわります Berubah 86 すいます Menghisap (rokok ) 126 はげまします Menghibur 166 よやくします Reservasi
7 あらいます Mencuci ( muka ) 47 かわります Kering 87 すっちょうします Tugas luar 127 はなれます Meninggalkan 167 りゅうがくします Kuliah luar negeri
8 あけます Membuka 48 かがやきます Bersinar 88 たべます Makan 128 はかります Mengukur 168 がまんします Bersabar
9 あきます Kosong 49 かよいます Pulang pergi 89 とびます Terbang 129 まもります Mematuhi 169 やくそくします Berjanji
10 あげます Memberi 50 かかります Memerlukan ( waktu ) 90 とどきます Sampai 130 まわします Memutarkan 170 やります Melakukan
11 あがります Mengangkat 51 かけます Menggantung 91 たります　＊ Kurang 131 まがります Berbelok
12 あわします Menyesuaikan 52 かきます Menulis 92 ためます Menabung 132 まげます Membelokkan
13 あやまります Bersalah 53 ききます Mendengarkan ( bertanya ) 93 てつだいます Membantu 133 まちます Menunggu
14 あゆみます Melangkah 54 かります　* Pinjam 94 とまります Menginap 134 もちます Membawa
15 あいします Mencintai 55 きがえます Ganti (baju ) 95 とじます Menutup ( mata ) 135 もっていきます Membawa pergi
16 あんないします Mengantarkan 56 コピーします Mengcopy 96 とめます Berhenti 136 もってきます Membawa datang
17 います　* Ada ( bernyawa ) 57 かんがえます Memikirkan 97 たちます Berdiri 137 まなびます Belajar ( dari lagu )
18 いります Perlu/butuh 58 かみます Menggigit 98 たします Menambahkan 138 まとめます Merangkum
19 いれます Memasukkan 59 かぶります Memakai ( topi ) 99 たすかります Terbantu 139 まけます Kalah
20 いきます Pergi 60 けっこんします Menikah 100 たすかります Bantu 140 まよいます Bingung
21 いいます Berkata 61 かちます Menang 101 つれていきます Mengajak pergi 141 みえます Kelihatan
22 いそぎます Buru-buru 62 くれます Memberi ( untuk saya ) 102 つれてきます Mengajak datang 142 みます Melihat
23 うたいます Bernyanyi 63 きます　＊ Datang 103 つかれます Lelah, capek 143 みせます Memperlihatkan
24 うります Menjual 64 かたづけます Membereskan 104 つくります Membuat 144 のります Naik (kereta )
25 うまれます Lahir 65 けんがくします Mengunjungi 105 つきます Tiba 145 のみます Minum
26 うちます Memukul 66 しめます Menutup 106 つづけます Melanjutkan 146 ねます Tidur
27 うんどうします Berolah raga 67 さがります Turun 107 つかいます Memakai 147 なきます Menangis
28 おきます Meletakkan 68 しんぱいします Khawatir 108 でます Keluar 148 のぼります Memanjat 
29 おきます　＊ Bangun ( tidur ) 69 しらべます Memeriksa 109 でかけます Pergi keluar 149 のこります Bersisa
30 おしえます Memberitahu 70 すわります Duduk 110 だします Mengeluarkan 150 なおします Memperbaiki (salah)
31 おします Mendorong 71 しゅうりします Memperbaiki ( sepeda) 111 でんわします Menelpon 151 ぬぎます Melepas ( baju )
32 おぼえます Mengingat 72 しまいます Menyimpan 112 できます　＊ Bisa,dapat 152 のりかえます Transit
33 おわります Selesai 73 ざんぎょうします Lembur 113 だまります Diam 153 ならいます Belajar ( dari )
34 おります　＊ Turun 74 しります Mengetahui (kenal ) 114 べんきょうします Belajar 154 ならびます Berbaris
35 おもいます Mengira 75 しょうくじします Makan ( bersama) 115 ちゅうもんします Memesan 155 にます Serupa
36 おもいだします Mengenang 76 しにます Meninggal 116 えらびます memilih 156 なおります Sembuh
37 おくります Mengirimkan 77 せんたくします Mencuci (baju ) 117 ふります Turun (hujan ) 157 わらいます Tertawa
38 おこります Marah 78 すてます Membuang 118 ふきます Mengelap 158 わけます Membagi
39 おちます　＊ Jatuh 79 せつめいします Menerangkan 119 はきます Memakai (sepatu) 159 わすれます Lupa
40 およぎます Berenang 80 すみます Tinggal 120 ひきます Memetik ( gitar ) 160 わたします Menyerahkan
"""
    items = []
    # Replace weird asterisks
    raw = raw.replace('　＊', '').replace('　*', '').replace(' *', '').replace(' ＊', '')
    pattern = re.compile(r'(\d+)\s+([^\s\d]+)\s+(.+?)(?=\s+\d+\s+[^\s\d]+|$)')
    for m in pattern.finditer(raw.replace('\n', ' ')):
        jp = m.group(2).strip()
        meaning = m.group(3).strip()
        items.append({"jp": jp, "id_translation": meaning})
    return items

def parse_others(raw):
    items = []
    for line in raw.strip().split('\n'):
        if not line.strip(): continue
        parts = line.strip().split()
        if len(parts) >= 4:
            # 1 難しい むずかしい Sulit/Sukar
            jp_kanji = parts[1]
            if parts[2] == '/': # 39 いい /よい いい /よい Baik/Bagus
               pass # handled differently
            # simple heur: first is num, last is meaning, middle is jp/kana
            # but some meanings have spaces: "Tinggi/Mahal" "Dingin (Cuaca)"
            # Let's just find the first string of ascii/latin chars
        
        # Better regex: Number (Kanji) (Kana) (Meaning...)
        m = re.match(r'^\d+\s+([^\sA-Za-z]+(?:\s*/[^\sA-Za-z]+)?)\s+([^\sA-Za-z]+(?:\s*/[^\sA-Za-z]+)?)\s+(.+)$', line)
        if m:
            jp = m.group(1)
            meaning = m.group(3)
            # if jp and kana are same, or want to show both:
            # wait, if jp is same as kana, just use jp. If different, maybe jp (kana)?
            # in previous sets, jp is the main display. We'll just use the kanji (if available) or kana as jp
            # The app shows jp, and doesn't explicitly have a kana field, just romaji.
            # We'll use kanji as jp, and maybe kana in parenthesis? Or just jp.
            jp_display = m.group(1).replace(' ', '')
            kana_display = m.group(2).replace(' ', '')
            if jp_display != kana_display:
                jp_val = f"{jp_display} ({kana_display})"
            else:
                jp_val = jp_display
            items.append({"jp": jp_val, "id_translation": meaning})
        else:
            # try to split by first latin char
            match = re.search(r'[A-Za-z]', line)
            if match:
                idx = match.start()
                jp_part = line[:idx].strip()
                meaning_part = line[idx:].strip()
                tokens = jp_part.split()
                if len(tokens) >= 3:
                    jp_display = tokens[1]
                    kana_display = tokens[2]
                    if jp_display != kana_display:
                        jp_val = f"{jp_display} ({kana_display})"
                    else:
                        jp_val = jp_display
                    items.append({"jp": jp_val, "id_translation": meaning_part})
                else:
                    items.append({"jp": tokens[1] if len(tokens)>1 else tokens[0], "id_translation": meaning_part})
    return items

ocr2_i = """
1 難しい むずかしい Sulit/Sukar
2 忙しい いそがしい Sibuk
3 短い みじかい Pendek
4 安い やすい Murah
5 正しい ただしい Benar
6 遅い おそい Lambat
7 寒い さむい Dingin (Cuaca)
8 冷たい つめたい Dingin (Benda)
9 薄い うすい Tipis
10 新しい あたらしい Baru
11 黒い くろい Hitam
12 赤い あかい Merah
13 大きい おおきい Besar
14 易しい やさしい Mudah
15 古い ふるい Tua/Kuno
16 白い しろい Putih
17 青い あおい Biru
18 小さい ちいさい Kecil
19 長い ながい Panjang
20 高い たかい Tinggi/Mahal
21 低い ひくい Rendah
22 固い かたい Keras
23 早い はやい Cepat
24 凄い すごい Hebat
25 涼しい すずしい Sejuk
26 悪い わるい Jelek/Jahat
27 不味い まずい Tidak Enak
28 親しい したしい Akrab/Mesra
29 熱い あつい Panas (Benda)
30 暑い あつい Panas (Cuaca) 
31 煩い うるさい Bising/Berisik
32 深い ふかい Dalam
33 厚い あつい Tebal
34 遠い とおい Jauh
35 恥かしい はずかしい Malu
36 楽しい たのしい Senang/Gembira
37 暖かい あたたかい Hangat
38 面白い おもしろい Menarik
39 いい /よい いい /よい Baik/Bagus
40 狭い せまい Sempit
41 美味しい おいしい Enak
42 塩辛い しおからい Asin
43 柔らかい やわらかい Lunak
44 汚い きたない Kotor
45 甘い あまい Manis
46 渋い しぶい Getir/Sepat
47 寂しい さびしい Sunyi
48 少ない すくない Sedikit
49 浅い あさい Dangkal
50 明るい あかるい Terang
51 近い ちかい Dekat
52 強い つよい Kuat
53 悲しい かなしい Sedih
54 厳しい きびしい Tegas/Galak
55 可笑しい おかしい Aneh/Lucu
56 恐い こわい Takut
57 広い ひろい Luas
58 酸っぱい すっぱい Asam
59 辛い からい Pedas
60 苦い にがい Pahit
61 多い おおい Banyak
62 暗い くらい Gelap
63 弱い よわい Lemah
64 若い わかい Muda
"""

ocr3_na = """
1 綺麗な きれいな Cantik
2 好きな すきな Suka
3 上手な じょうずな Pintar
4 下手な へたな Kurang Pintar
5 色々な いろいろな Bermacam-macam
6 丁寧な ていねいな Sopan
7 賑やかな にぎやかな Ramai
8 便利な べんりな Praktis
9 伝統的な でんとうてきな Tradisional
10 親切な しんせつな Ramah
11 貧乏な びんぼうな Miskin
12 盛んな さかんな Populer
13 残念な ざんねんな Kecewa/Sayang
14 簡単な かんたんな Sederhana
15 立派な りっぱな Megah
16 温和な おんわな Lemah Lembut
17 悪戯な いたずらな Nakal
18 有名な ゆうめいな Terkenal
19 馬鹿な ばかな Bodoh
20 丈夫な じょうぶな Kuat/Sehat
21 元気な げんきな Sehat
22 失礼な しつれいな Kurang Ajar
23 静かな しずかな Tenang
24 不便な ふべんな Tidak Praktis
25 怠惰な たいだな Malas
26 勤勉な きんべんな Rajin/Tekun
27 裕福な ゆうふくな Makmur
28 不思議な ふしぎな Ajaib
29 真面目な まじめな Serius
30 残酷な ざんこくな Kejam 
31 暇な ひまな Luang/Senggang
32 平凡な へいぼんな Umum/Biasa
"""

ocr4_noun = """
1 あき あき musim gugur
2 あまり あまり tidak begitu
3 雨 あめ hujan
4 あなた あなた anda
5 あね/おねえさん あね/おねえさん kakak perempuan
6 あに / おにいさん あに / おにいさん kakak laki-laki
7 アパート アパート apartement
8 あさ あさ pagi
9 あさごはん あさごはん sarapan pagi
10 あさって あさって besok lusa
11 足 あし kaki
12 明日 あした/あす besok
13 あたま あたま kepala
14 ばんごはん ばんごはん makan malam
15 ばんごう ばんごう nomor
16 バス バス bis
17 バッター バッター mentega
18 ベッド ベッド ranjang
19 べんきょう べんきょう belajar
20 ボールペン ボールペン bolpoin
21 ボタン ボタン tombol
22 ぼうし ぼうし topi
23 ぶたにく ぶたにく daging babi
24 びょういん びょういん rumah sakit
25 ちかてつ ちかてつ kereta bawah tanah
26 ちず ちず peta
27 だいどころ だいどころ dapur
28 大学 だいがく universitas
29 だれ だれ siapa
30 だれか だれか seseorang 
31 土よう日 どようび hari sabtu
32 だれも だれも siapapun
33 出口 でぐち pintu keluar
34 電車 でんしゃ kereta
35 電話 でんわ telepon
36 デパート デパート departement
37 ドア ドア pintu
38 どうぶつ どうぶつ hewan/binatang
39 え え gambar/lukisan
40 えいが えいが film
41 えいがかん えいがかん bioskop
42 えいご えいご bahasa inggris
43 駅 えき stasiun
44 円 えん yen
45 えんぴつ えんぴつ pensil
46 エレベーター エレベーター elevator
47 フィルム フィルム film
48 フォーク フォーク garpu
49 ふく ふく pakaian
50 二人 ふたり berdua
51 二つ ふたつ dua buah
52 ふゆ ふゆ musim dingin
53 ふゆやすみ ふゆやすみ libur musim dingin
54 外国 がいこく negara luar
55 外国人 がいこくじん orang asing
56 学校 がっこう sekolahan
57 学生 がくせい pelajar
58 げんかん げんかん pintu gerbang
59 月よう日 げつようび hari senin
60 ぎんこう ぎんこう bank
61 ギター ギター gitar 
62 五月 ごがつ mai
63 ごご ごご sore/PM
64 ごはん ごはん nasi
65 ごぜん ごぜん pagi/AM
66 グラム グラム gram
67 グラス グラス glass
68 ぎゅうにく ぎゅうにく daging sapi
69 ぎゅうにゅう ぎゅうにゅう susu sapi
70 八月 はちがつ agustus
71 は は gigi
72 はがき はがき kartu pos
73 母/ お母さん はは /おかあさん ibu
74 はいざら はいざら asbak
75 はじめ はじめ permulaan
76 はこ はこ kotak
77 花 はな bunga
78 鼻 はな hidung
79 話 はなし berbicara
80 はんぶん はんぶん setengah
81 ハンカチ ハンカチ sapu tangan
82 はたち はたち dua puluh tahun
83 へや へや kamar
84 左 ひだり kiri
85 ひがし ひがし timur
86 ひこうき ひこうき pesawat
87 ひらがな ひらがな hiragana
88 ひるごはん ひるごはん makan siang
89 人 ひと orang
90 一人 ひとり sendiri
91 一つ ひとつ sebuah
92 ほか ほか yang lain 
93 本 ほん buku
94 ほんだな ほんだな rak buku
95 ホテル ホテル hotel
96 百 ひゃく seratus
97 いち いち satu
98 いちばん いちばん paling/nomer satu
99 一月 いちがつ januari
100 一日 いちにち /ついたち tanggal 1/satu hari
101 いえ /うち いえ /うち rumah
102 いけ いけ kolam
103 いま いま sekarang
104 いみ いみ arti
105 いもうと いもうと adik perempuan
106 入り口 いりぐち pintu masuk
107 いろ いろ warna
108 いしゃ いしゃ dokter
109 いっしょ いっしょ bersama
110 いす いす bangku
111 いつ いつ kapan
112 いつか いつか suatu saat
113 いつも いつも selalu
114 じぶん じぶん diri
115 時間 じかん waktu
116 じしょ じしょ kamus
117 じてんしゃ じてんしゃ sepeda
118 じゅぎょう じゅぎょう pelajaran
119 十 じゅう sepuluh
120 十月 じゅうがつ oktober
121 十一月 じゅういちがつ november
122 十二月 じゅうにがつ desember
123 かばん かばん tas 
124 かびん かびん pot bunga
125 角 かど sudut
126 かぎ かぎ kunci
127 かいだん かいだん tangga
128 買い物 かいもの belanja
129 かいしゃ かいしゃ perusahaan
130 カメラ カメラ kamera
131 かみ かみ kertas, rambut
132 かんじ かんじ huruf kanji
133 かお かお wajah
134 体 からだ tubuh
135 カレンダー カレンダー kalender
136 かさ かさ payung
137 かたかな かたかな katakana
138 火よう日 かようび hari selasa
139 風 かぜ angin
140 風邪 かぜ flu/masuk angin
141 かぞく かぞく keluarga
142 けっこん けっこん pernikahan
143 けさ けさ pagi ini
144 木 き pohon
145 昨日 きのう kemarin
146 金よう日 きんようび hari jumat
147 きっぷ きっぷ tiket
148 キロ キロ kilo
149 きっさてん きっさてん kedai kopi
150 切手 きって perangko
151 子ども こども anak-anak
152 こえ こえ suara
153 こんばん こんばん malam ini
154 今月 こんげつ tahun ini 
155 こんな こんな seperti ini
156 こんしゅう こんしゅう minggu ini
157 コップ コップ cangkir
158 ことば ことば kata-kata
159 今年 ことし tahun ini
160 こうばん こうばん pos polisi
161 こうえん こうえん taman
162 くち くち mulut
163 くだもの くだもの buah-buahan
164 九月 くがつ september
165 くも くも awan
166 くもり くもり mendung
167 クラス クラス class
168 車 くるま mobil
169 くすり くすり obat
170 くつ くつ sepatu
171 くつした くつした kaus kaki
172 きょねん きょねん tahun lalu
173 今日 きょう hari ini
174 きょうだい きょうだい saudara
175 教室 きょうしつ kelas
176 九 きゅう sembilan
177 町 まち kota
178 まだ まだ masih
179 まど まど jendela
180 前 まえ depan/sebelum
181 まいあさ まいあさ setiap pagi
182 まいばん まいばん setiap malam
183 まいねん まいねん setiap tahun
184 まいにち まいにち setiap hari
185 まいしゅう まいしゅう setiap minggu 
186 まいつき まいつき setiap bulan
187 万 まん sepuluh ribu
188 また また lagi
189 め め mata
190 メートル メートル meter
191 めがね めがね kacamata
192 道 みち jalan
193 耳 みみ telinga
194 みなみ みなみ selatan
195 みんな みんな semua orang
196 店 みせ toko
197 水 みず air
198 もちろん もちろん tentu
199 木よう日 もくようび hari kamis
200 もん もん gerbang
201 もんだい もんだい masalah
202 物 もの barang/sesuatu
203 もしもし もしもし halo (ditelpon)
204 もっと もっと lebih
205 もう もう sudah
206 ナイフ ナイフ pisau
207 名前 なまえ nama
208 なつ なつ musim panas
209 なつやすみ なつやすみ libur musim panas
210 ネクタイ ネクタイ dasi
211 日よう日 にちようび hari minggu
212 二月 にがつ febuari
213 にく にく daging
214 にもつ にもつ barang bawaan
215 にし にし barat
216 にわ にわ halaman 
217 飲み物 のみもの minuman
218 ノート ノート catatan
219 ニュース ニュース berita
220 おばあさん おばあさん nenek
221 おばさん おばさん bibi/tante
222 おべんとう おべんとう kotak makan siang
223 お茶 おちゃ teh
224 おふろ おふろ kamar mandi
225 おじいさん おじいさん kakek
226 おじさん おじさん paman
227 お金 おかね uang
228 おかし おかし permen/snack
229 同じ おなじ sama
230 おなか おなか perut
231 おんがく おんがく musik
232 女 おんな perempuan
233 おおぜい おおぜい orang banyak
234 おさけ おさけ arak
235 おさら おさら piring
236 お手洗い /トイレ おてあらい /トイレ toilet
237 男 おとこ laki-laki
238 大人 おとな dewasa
239 おととし おととし dua tahun yang lalu
240 おとうと おとうと adik laki-laki
241 おっとごしゅじん おっと /ごしゅじん suami
242 パーティ パーティ pesta
243 パン パン roti
244 ペン ペン pen
245 ポケット ポケット saku
246 らいげつ らいげつ bulan depan
247 らいねん らいねん tahun depan 
248 らいしゅう らいしゅう minggu depan
249 ラジオ ラジオ radio
250 冷蔵庫 れいぞうこ kulkas
251 れんしゅう れんしゅう berlatih
252 レストラン レストラン restoran
253 六 ろく enam
254 六月 ろくがつ juni
255 りょこう りょこう tamasya
256 りょうり りょうり masakan
257 りょうしん りょうしん orang tua
258 りゅうがくせい りゅうがくせい pelajar asing
259 魚 さかな ikan
260 先 さき ujung/tadi
261 作文 さくぶん essai/karangan
262 三 さん tiga
263 三月 さんがつ maret
264 さんぽ さんぽ jalan-jalan
265 さらいねん さらいねん dua tahun kedepan
266 さとう さとう gula
267 セーター セーター switer
268 せいと せいと murid
269 せっきん せっけん sabun
270 千 せん / ち seribu
271 先月 せんげつ bulan lalu
272 先生 せんせい guru
273 せんしゅう せんしゅう minggu lalu
274 せんたく せんたく pilihan, mencuci
275 しゃしん しゃしん foto/gambar
276 シャツ シャツ baju
277 四 し /よん empat
278 七月 しちがつ juli 
279 四月 しがつ april
280 しごと しごと pekerjaan
281 しかし しかし tetapi
282 新聞 しんぶん koran
283 しお しお garam
284 下 した bawah
285 しつもん しつもん pertanyaan
286 しょくどう しょくどう kantin
287 しょうゆ しょうゆ kecap
288 しゅくだい しゅくだい pekerjaan rumah
289 そば そば di sisi
290 そんな そんな seperti itu
291 空 そら langit
292 そうじ そうじ bersih-bersih
293 水よう日 すいようび hari rabu
294 スカート スカート rok
295 スポーツ スポーツ olah raga
296 スプーン スプーン sendok
297 ストーブ ストーブ penghangat ruangan
298 食べ物 たべもの makanan
299 たいしかん たいしかん kedutaan
300 たくさん たくさん banyak
301 タクシー タクシー taksi
302 たまご たまご telur
303 たんじょうび たんじょうび hari ulang tahun
304 たてもの たてもの bangunan
305 手 て tangan
306 テープ テープ tape
307 てがみ てがみ surat
308 天気 てんき cuaca
309 テレビ テレビ televisi 
310 テスト テスト tes
311 とけい とけい jam tangan
312 ところ ところ tempat
313 とり とり burung
314 としょかん としょかん perpustakaan
315 つくえ つくえ meja
316 つま /おくさん つま /おくさん istri
317 上 うえ atas
318 うみ うみ laut
319 後ろ うしろ belakang
320 うた うた lagu
321 うわぎ うわぎ jaket
322 私 わたし saya
323 山 やま gunung
324 やおや やおや toko sayuran
325 休み やすみ libur
326 ようふく ようふく pakaian barat
327 ざっし ざっし majalah
328 ぜんぶ ぜんぶ semuanya
329 ゼロ ゼロ nol 
"""

verbs = parse_verbs()
i_adj = parse_others(ocr2_i)
na_adj = parse_others(ocr3_na)
nouns = parse_others(ocr4_noun)

print(f"Parsed {len(verbs)} verbs, {len(i_adj)} i_adj, {len(na_adj)} na_adj, {len(nouns)} nouns")

ts_content = f"""
export const kataKerja = {json.dumps(verbs, indent=2)};
export const kataSifatI = {json.dumps(i_adj, indent=2)};
export const kataSifatNa = {json.dumps(na_adj, indent=2)};
export const kataBenda = {json.dumps(nouns, indent=2)};
"""

with open('src/data/newMaterials.ts', 'w') as f:
    f.write(ts_content)

