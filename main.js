const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player');
const playList = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Chúng Ta Của Tương Lai',
            singer: 'Sơn Tùng',
            path: '/assets/music/chung-ta-cua-tuong-lai.mp3',
            image: '/assets/img/chung-ta-cua-tuong-lai.png'
        },
        {
            name: 'Chúng Ta Của Hiện Tại',
            singer: 'Sơn Tùng',
            path: '/assets/music/chung-ta-cua-hien-tai.mp3',
            image: '/assets/img/chung_ta_caa_hien_tai.jpg'
        },
        {
            name: 'Có Chắc Yêu Là Đây',
            singer: 'Sơn Tùng',
            path: '/assets/music/co-chac-yeu-la-day.mp3',
            image: '/assets/img/co-chac-yeu-la-day.jpg'
        },
        {
            name: 'Trái Tim Giữa Bầu Trời',
            singer: 'Trịnh Đình Quang',
            path: '/assets/music/trai-tim-giua-bau-troi.mp3',
            image: '/assets/img/trai-timgiua-bau-troi.jpg'
        },
        {
            name: 'Thịnh Vượng Việt Nam Sáng Ngời',
            singer: 'Bùi Trường Linh',
            path: '/assets/music/thinh-vuong-viet-nam.mp3',
            image: '/assets/img/thinh-vuong-viet-nam.jpg'
        },
        {
            name: 'Vệt Nắng Cuối Trời',
            singer: 'Tiến Minh',
            path: '/assets/music/viet-nang-cuoi-troi.mp3',
            image: '/assets/img/vet-nang-cuoi-troi.jpg'
        },
        {
            name: 'Tốt Cho Cả Hai',
            singer: 'Trung Quân',
            path: '/assets/music/tot-cho-ca-hai.mp3',
            image: '/assets/img/tot-cho-ca-hai.jpg'
        },
        {
            name: 'Tôi Là Ai Và Đây Là Đâu',
            singer: 'Lục Hải Đào',
            path: '/assets/music/toi-la-ai.mp3',
            image: '/assets/img/toi-la-ai.png'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}">
                    <div
                        class="thumb"
                        style="
                        background-image: url('${song.image}');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    }
    ,
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth
        const cdRotate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 20000,
            fill: 'forwards',
            easing: 'ease-in-out',
            iterations: Infinity
        })
        cdRotate.pause()
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }
        // handle play
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdRotate.play()
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdRotate.pause()
        }
        // handle music rewind
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //handle seek
        progress.oninput = function (e) {
            console.log(audio.duration / 100 * e.target.value)
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;

        }
        //handle next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            }
            else {
                _this.nextSong();
            }

            audio.play();
            _this.render();
            _this.scrollToActiveSong()
        }
        //handle prev song
        prevBtn.onclick = function () {
            _this.prevSong();
            audio.play();
            _this.render();
            _this.scrollToActiveSong()
        }
        //handle random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //handle when ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()
            }
        }
        //handle repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
    },
    scrollToActiveSong: function () {

    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        console.log(this.currentIndex, this.songs.length)
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    start: function () {
        //Defines properties for the object
        this.defineProperties()
        //Listen and process events(DOM Event)
        this.handleEvents();
        //Load the first song's information into the UI when running the application
        this.loadCurrentSong();
        //Render Playlist
        this.render();
    }
}
app.start()