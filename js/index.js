const MODE_NORMAL = 1, MODE_ENDLESS = 2, MODE_PRACTICE = 3, MODE_CAT = 4;
var mode = MODE_NORMAL; // global, accessible from playSound

// 内嵌 i18n
const I18N_DATA = {
    zh:{"lang":"zh","start":"开始游戏","normal":"普通模式","endless":"无尽模式","practice":"练习模式","settings":"游戏设置","img-before":"点击前图","img-after":"点击后图","sound-on":"音效: 开启","sound-off":"音效: 关闭","title":"标题","time":"时间","key":"按键","ok":"确定","eat-kano":"糯糯健身💪","default-dfjk":"默认为DFJK","default-20s":"默认为20秒","game-title":"糯糯健身💪","game-intro1":"帮助肥糯糯","game-intro2":"变成壮糯糯","time-up":"时间到","calculating":"计算中","score":"得分","best":"最佳","again":"重来","home":"主页","repo":"仓库","text-level-1":"试着好好练一下?","text-level-2":"TCL","text-level-3":"TQL","text-level-4":"您","text-level-5":"人?","time-over":"倒计时多了"},
    en:{"lang":"en","start":"Start","normal":"Normal","endless":"Endless","practice":"Practice","settings":"Settings","img-before":"Img-before","img-after":"Img-after","sound-on":"Sound: on","sound-off":"Sound: off","title":"Title","time":"Time","key":"Key","ok":"OK","eat-kano":"Eat Kano","default-dfjk":"DFJK by default","default-20s":"20s by default","game-title":"Eat Kano","game-intro1":"Start from the bottom","game-intro2":"Can you tap 150 times?","time-up":"Time up","calculating":"Wait...","score":"Score","best":"Best","again":"Again","home":"Home","repo":"Repo","text-level-1":"Try again?","text-level-2":"Not bad","text-level-3":"Nice","text-level-4":"Awesome","text-level-5":"R U kidding?","time-over":"Cheated for "},
    ja:{"lang":"ja","start":"開始","normal":"普通モード","endless":"無限モード","practice":"練習モード","settings":"設定","img-before":"クリック前","img-after":"クリック後","sound-on":"効果音: on","sound-off":"効果音: off","title":"タイトル","time":"時間","key":"キー","ok":"確認","eat-kano":"Eat Kano","default-dfjk":"デフォルトはDFJK","default-20s":"デフォルトは20秒","game-title":"Eat Kano","game-intro1":"底から始める","game-intro2":"Tap150できる?","time-up":"タイムアップ","calculating":"待つ...","score":"スコア","best":"最高","again":"再び","home":"ホーム","repo":"レポ","text-level-1":"この程度？","text-level-2":"まだまだだよ","text-level-3":"悪くないね","text-level-4":"うまいじゃん","text-level-5":"もう人間の限界だ","time-over":"カウントダウン偏差 "}
};

// 音效：nuo1-4 随机播放（点击），err/end 用 Web Audio
var tapAudios = [];
for (var i = 1; i <= 4; i++) {
    var a = new Audio('./audio/nuo' + i + '.mp3');
    a.preload = 'auto';
    tapAudios.push(a);
}

var catTapAudio = new Audio('./audio/老吴？！.mp3');
catTapAudio.preload = 'auto';
var catErrAudio = new Audio('./audio/吴老？！.mp3');
catErrAudio.preload = 'auto';
var catEndAudio = new Audio('./audio/吴老？！.mp3');
catEndAudio.preload = 'auto';
var nuonuoErrAudio = new Audio('./audio/nuonuo.mp3');
nuonuoErrAudio.preload = 'auto';
nuonuoErrAudio.volume = 0.15;

var AudioCtx = null;
function getAudioCtx() {
    if (!AudioCtx) AudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return AudioCtx;
}

function playSound(id) {
    if (id === 'tap') {
        if (typeof mode !== 'undefined' && mode === MODE_CAT) {
            catTapAudio.currentTime = 0;
            catTapAudio.play().catch(function(){});
        } else {
            var aud = tapAudios[Math.floor(Math.random() * 4)];
            aud.currentTime = 0;
            aud.play().catch(function(){});
        }
    } else if (id === 'err') {
        if (typeof mode !== 'undefined' && mode === MODE_CAT) {
            catErrAudio.currentTime = 0;
            catErrAudio.play().catch(function(){});
        } else {
            nuonuoErrAudio.currentTime = 0;
            nuonuoErrAudio.play().catch(function(){});
        }
    } else if (id === 'end') {
        if (typeof mode !== 'undefined' && mode === MODE_CAT) {
            catEndAudio.currentTime = 0;
            catEndAudio.play().catch(function(){});
        } else {
            try {
                var ctx = getAudioCtx();
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
            } catch(e) {}
        }
    }
}

(function(w) {
    function getLang() {
        var l = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (/^zh/.test(l)) return 'zh';
        if (/^ja/.test(l)) return 'ja';
        return 'en';
    }

    const I18N = I18N_DATA[getLang()] || I18N_DATA['en'];

    $('[data-i18n]').each(function() {
        var v = I18N[this.dataset.i18n];
        if (v) $(this).text(v);
    });
    $('[data-placeholder-i18n]').each(function() {
        var v = I18N[this.dataset.placeholderI18n];
        if (v) $(this).attr('placeholder', v);
    });
    $('html').attr('lang', I18N['lang']);

    let isDesktop = !navigator['userAgent'].match(/(ipad|iphone|ipod|android|windows phone)/i);
    let fontunit = isDesktop ? 20 : ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) / 320) * 10;
    document.write('<style type="text/css">' +
        'html,body {font-size:' + (fontunit < 30 ? fontunit : '30') + 'px;}' +
        (isDesktop ? '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position: absolute;}' :
            '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position:fixed;}') +
        '</style>');
    let map = {'d': 1, 'f': 2, 'j': 3, 'k': 4};
    if (isDesktop) {
        document.write('<div id="gameBody">');
        document.onkeydown = function (e) {
            let key = e.key.toLowerCase();
            if (Object.keys(map).indexOf(key) !== -1) {
                click(map[key])
            }
        }
    }

    let body, blockSize, GameLayer = [],
        GameLayerBG, touchArea = [],
        GameTimeLayer;
    let transform, transitionDuration, welcomeLayerClosed;
    mode = getMode();
    let soundMode = getSoundMode();

    w.init = function() {
        showWelcomeLayer();
        body = document.getElementById('gameBody') || document.body;
        body.style.height = window.innerHeight + 'px';
        transform = typeof (body.style.webkitTransform) != 'undefined' ? 'webkitTransform' : (typeof (body.style.msTransform) !=
        'undefined' ? 'msTransform' : 'transform');
        transitionDuration = transform.replace(/ransform/g, 'ransitionDuration');
        GameTimeLayer = document.getElementById('GameTimeLayer');
        GameLayer.push(document.getElementById('GameLayer1'));
        GameLayer[0].children = GameLayer[0].querySelectorAll('div');
        GameLayer.push(document.getElementById('GameLayer2'));
        GameLayer[1].children = GameLayer[1].querySelectorAll('div');
        GameLayerBG = document.getElementById('GameLayerBG');
        if (GameLayerBG.ontouchstart === null) {
            GameLayerBG.ontouchstart = gameTapEvent;
        } else {
            GameLayerBG.onmousedown = gameTapEvent;
        }
        gameRestart();
        initSetting();
        if (mode === MODE_CAT) $(document.body).addClass('cat-mode');
        window.addEventListener('resize', refreshSize, false);
    }

    function getMode() {
        return cookie('gameMode') ? parseInt(cookie('gameMode')) : MODE_NORMAL;
    }

    function getSoundMode() {
        return cookie('soundMode') ? cookie('soundMode') : 'on';
    }

    w.changeSoundMode = function() {
        if (soundMode === 'on') {
            soundMode = 'off';
            $('#sound').text(I18N['sound-off']);
        } else {
            soundMode = 'on';
            $('#sound').text(I18N['sound-on']);
        }
        cookie('soundMode', soundMode);
    }

    function modeToString(m) {
        if (m === MODE_NORMAL) return I18N['normal'];
        if (m === MODE_ENDLESS) return I18N['endless'];
        if (m === MODE_PRACTICE) return I18N['practice'];
        return '糯耋🐱模式';
    }

    w.changeMode = function(m) {
        mode = m;
        cookie('gameMode', m);
        $('#mode').text(modeToString(m));
        if (m === MODE_CAT) {
            $(document.body).addClass('cat-mode');
        } else {
            $(document.body).removeClass('cat-mode');
        }
        gameRestart();
    }

    w.readyBtn = function() {
        closeWelcomeLayer();
        updatePanel();
    }

    let refreshSizeTime;
    function refreshSize() {
        clearTimeout(refreshSizeTime);
        refreshSizeTime = setTimeout(_refreshSize, 200);
    }

    function _refreshSize() {
        countBlockSize();
        for (let i = 0; i < GameLayer.length; i++) {
            let box = GameLayer[i];
            for (let j = 0; j < box.children.length; j++) {
                let r = box.children[j], rstyle = r.style;
                rstyle.left = (j % 4) * blockSize + 'px';
                rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
                rstyle.width = blockSize + 'px';
                rstyle.height = blockSize + 'px';
            }
        }
        let f, a;
        if (GameLayer[0].y > GameLayer[1].y) {
            f = GameLayer[0]; a = GameLayer[1];
        } else {
            f = GameLayer[1]; a = GameLayer[0];
        }
        let y = ((_gameBBListIndex) % 10) * blockSize;
        f.y = y;
        f.style[transform] = 'translate3D(0,' + f.y + 'px,0)';
        a.y = -blockSize * Math.floor(f.children.length / 4) + y;
        a.style[transform] = 'translate3D(0,' + a.y + 'px,0)';
    }

    function countBlockSize() {
        blockSize = body.offsetWidth / 4;
        body.style.height = window.innerHeight + 'px';
        GameLayerBG.style.height = window.innerHeight + 'px';
        touchArea[0] = window.innerHeight;
        touchArea[1] = window.innerHeight - blockSize * 3;
    }

    let _gameBBList = [], _gameBBListIndex = 0, _gameOver = false, _gameStart = false,
        _gameSettingNum = 20, _gameTime, _gameTimeNum, _gameScore, _date1, deviationTime;
    let _gameStartTime, _gameStartDatetime;

    function gameRestart() {
        _gameBBList = []; _gameBBListIndex = 0; _gameScore = 0;
        _gameOver = false; _gameStart = false;
        _gameTimeNum = _gameSettingNum; _gameStartTime = 0;
        countBlockSize();
        refreshGameLayer(GameLayer[0]);
        refreshGameLayer(GameLayer[1], 1);
        updatePanel();
    }

    function gameStart() {
        _date1 = new Date();
        _gameStartDatetime = _date1.getTime();
        _gameStart = true;
        _gameTime = setInterval(timer, 1000);
    }

    function getCPS() {
        let cps = _gameScore / ((new Date().getTime() - _gameStartDatetime) / 1000);
        if (isNaN(cps) || cps === Infinity || _gameStartTime < 2) cps = 0;
        return cps;
    }

    function timer() {
        _gameTimeNum--; _gameStartTime++;
        if ((mode === MODE_NORMAL || mode === MODE_CAT) && _gameTimeNum <= 0) {
            GameTimeLayer.innerHTML = I18N['time-up'] + '!';
            gameOver();
            GameLayerBG.className += ' flash';
            playSound('end');
        }
        updatePanel();
    }

    function updatePanel() {
        if (mode === MODE_NORMAL || mode === MODE_CAT) {
            if (!_gameOver) GameTimeLayer.innerHTML = 'TIME:' + Math.ceil(_gameTimeNum);
        } else if (mode === MODE_ENDLESS) {
            let cps = getCPS();
            GameTimeLayer.innerHTML = 'CPS:' + (cps === 0 ? I18N['calculating'] : cps.toFixed(2));
        } else {
            GameTimeLayer.innerHTML = 'SCORE:' + _gameScore;
        }
    }

    function foucusOnReplay() { $('#replay').focus() }

    function gameOver() {
        _gameOver = true;
        clearInterval(_gameTime);
        let cps = getCPS();
        updatePanel();
        setTimeout(function () {
            GameLayerBG.className = '';
            showGameScoreLayer(cps);
            foucusOnReplay();
        }, 1500);
    }

    let _ttreg = / [tc]{1,2}(\d+)/, _clearttClsReg = / [tc]{1,2}\d+| bad/;

    function refreshGameLayer(box, loop, offset) {
        let i = Math.floor(Math.random() * 1000) % 4 + (loop ? 0 : 4);
        for (let j = 0; j < box.children.length; j++) {
            let r = box.children[j], rstyle = r.style;
            rstyle.left = (j % 4) * blockSize + 'px';
            rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
            rstyle.width = blockSize + 'px';
            rstyle.height = blockSize + 'px';
            r.className = r.className.replace(_clearttClsReg, '');
            if (i === j) {
                _gameBBList.push({ cell: i % 4, id: r.id });
                let prefix = mode === MODE_CAT ? 'c' : 't';
                r.className += ' ' + prefix + (Math.floor(Math.random() * 1000) % 5 + 1);
                r.notEmpty = true;
                i = (Math.floor(j / 4) + 1) * 4 + Math.floor(Math.random() * 1000) % 4;
            } else {
                r.notEmpty = false;
            }
        }
        if (loop) {
            box.style.webkitTransitionDuration = '0ms';
            box.style.display = 'none';
            box.y = -blockSize * (Math.floor(box.children.length / 4) + (offset || 0)) * loop;
            setTimeout(function () {
                box.style[transform] = 'translate3D(0,' + box.y + 'px,0)';
                setTimeout(function () { box.style.display = 'block'; }, 100);
            }, 200);
        } else {
            box.y = 0;
            box.style[transform] = 'translate3D(0,' + box.y + 'px,0)';
        }
        box.style[transitionDuration] = (mode === MODE_CAT ? '80ms' : '150ms');
    }

    function gameLayerMoveNextRow() {
        for (let i = 0; i < GameLayer.length; i++) {
            let g = GameLayer[i];
            g.y += blockSize;
            if (g.y > blockSize * (Math.floor(g.children.length / 4))) {
                refreshGameLayer(g, 1, -1);
            } else {
                g.style[transform] = 'translate3D(0,' + g.y + 'px,0)';
            }
        }
    }

    function gameTapEvent(e) {
        if (_gameOver) return false;
        let tar = e.target;
        let y = e.clientY || e.targetTouches[0].clientY,
            x = (e.clientX || e.targetTouches[0].clientX) - body.offsetLeft,
            p = _gameBBList[_gameBBListIndex];
        if (y > touchArea[0] || y < touchArea[1]) return false;
        if ((p.id === tar.id && tar.notEmpty) || (p.cell === 0 && x < blockSize) || (p.cell === 1 && x > blockSize && x < 2 * blockSize) || (p.cell === 2 && x > 2 * blockSize && x < 3 * blockSize) || (p.cell === 3 && x > 3 * blockSize)) {
            if (!_gameStart) gameStart();
            playSound('tap');
            tar = document.getElementById(p.id);
            tar.className = tar.className.replace(_ttreg, (match, num) => ' ' + match.trim().charAt(0) + match.trim().charAt(0) + num);
            _gameBBListIndex++; _gameScore++;
            updatePanel();
            gameLayerMoveNextRow();
        } else if (_gameStart && !tar.notEmpty) {
            playSound('err');
            tar.classList.add('bad');
            if (mode === MODE_PRACTICE) {
                setTimeout(() => { tar.classList.remove('bad'); }, 500);
            } else {
                gameOver();
            }
        }
        return false;
    }

    function createGameLayer() {
        let html = '<div id="GameLayerBG">';
        for (let i = 1; i <= 2; i++) {
            let id = 'GameLayer' + i;
            html += '<div id="' + id + '" class="GameLayer">';
            for (let j = 0; j < 10; j++) {
                for (let k = 0; k < 4; k++) {
                    html += '<div id="' + id + '-' + (k + j * 4) + '" num="' + (k + j * 4) + '" class="block' + (k ? ' bl' : '') + '"></div>';
                }
            }
            html += '</div>';
        }
        html += '</div><div id="GameTimeLayer" class="text-center"></div>';
        return html;
    }

    function closeWelcomeLayer() {
        welcomeLayerClosed = true;
        $('#welcome').css('display', 'none');
        updatePanel();
    }

    function showWelcomeLayer() {
        welcomeLayerClosed = false;
        $('#mode').text(modeToString(mode));
        $('#welcome').css('display', 'block');
    }

    function getBestScore(score) {
        let cookieName = (mode === MODE_NORMAL ? 'best-score' : (mode === MODE_CAT ? 'cat-best-score' : 'endless-best-score'));
        let best = cookie(cookieName) ? Math.max(parseFloat(cookie(cookieName)), score) : score;
        cookie(cookieName, best.toFixed(2), 100);
        return best;
    }

    function scoreToString(score) {
        return mode === MODE_ENDLESS ? score.toFixed(2) : score.toString();
    }

    function legalDeviationTime() {
        return deviationTime < (_gameSettingNum + 3) * 1000;
    }

    function showGameScoreLayer(cps) {
        let l = $('#GameScoreLayer');
        let c = $(`#${_gameBBList[_gameBBListIndex - 1].id}`).attr('class').match(_ttreg)[1];
        let score = (mode === MODE_ENDLESS ? cps : _gameScore);
        let best = getBestScore(score);
        l.attr('class', l.attr('class').replace(/bgc\d/, 'bgc' + c));
        $('#GameScoreLayer-text').html(shareText(cps));
        let normalCond = legalDeviationTime() || (mode !== MODE_NORMAL && mode !== MODE_CAT);
        l.css('color', normalCond ? '' : 'red');
        $('#cps').text(cps.toFixed(2));
        $('#score').text(scoreToString(score));
        $('#GameScoreLayer-score').css('display', mode === MODE_ENDLESS ? 'none' : '');
        $('#best').text(scoreToString(best));
        l.css('display', 'block');
    }

    function hideGameScoreLayer() {
        $('#GameScoreLayer').css('display', 'none');
    }

    w.replayBtn = function() {
        gameRestart();
        hideGameScoreLayer();
    }

    function shareText(cps) {
        if (mode === MODE_NORMAL || mode === MODE_CAT) {
            let date2 = new Date();
            deviationTime = (date2.getTime() - _date1.getTime())
            if (!legalDeviationTime()) {
                return I18N['time-over'] + ((deviationTime / 1000) - _gameSettingNum).toFixed(2) + 's';
            }
        }
        if (cps <= 5) return I18N['text-level-1'];
        if (cps <= 8) return I18N['text-level-2'];
        if (cps <= 10) return I18N['text-level-3'];
        if (cps <= 15) return I18N['text-level-4'];
        return I18N['text-level-5'];
    }

    function toStr(obj) {
        if (typeof obj === 'object') return JSON.stringify(obj);
        else return obj;
    }

    function cookie(name, value, time) {
        if (name) {
            if (value) {
                return localStorage.setItem(name, toStr(value)), !0;
            }
            var v = localStorage.getItem(name);
            if (v === null) return !1;
            if (/^(\{|\[).+\}|\]$/.test(v) || /^[0-9]+$/g.test(v)) eval("v=" + v);
            return v;
        }
        var data = {};
        for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            var v = localStorage.getItem(k);
            data[k] = v;
        }
        return data;
    }

    document.write(createGameLayer());

    function initSetting() {
        if (cookie("title")) {
            $('title').text(cookie('title'));
            $('#title').val(cookie('title'));
        }
        let keyboard = cookie('keyboard');
        if (keyboard) {
            keyboard = keyboard.toString().toLowerCase();
            $("#keyboard").val(keyboard);
            map = {}
            map[keyboard.charAt(0)] = 1;
            map[keyboard.charAt(1)] = 2;
            map[keyboard.charAt(2)] = 3;
            map[keyboard.charAt(3)] = 4;
        }
        if (cookie('gameTime')) {
            $('#gameTime').val(cookie('gameTime'));
            _gameSettingNum = parseInt(cookie('gameTime'));
            gameRestart();
        }
    }

    w.show_btn = function() {
        $("#btn_group,#desc").css('display', 'block')
        $('#setting').css('display', 'none')
    }

    w.show_setting = function() {
        $('#btn_group,#desc').css('display', 'none')
        $('#setting').css('display', 'block')
        $('#sound').text(soundMode === 'on' ? I18N['sound-on'] : I18N['sound-off']);
    }

    w.save_cookie = function() {
        const settings = ['keyboard', 'title', 'gameTime'];
        for (let s of settings) {
            let value = $(`#${s}`).val();
            if (value) cookie(s, value.toString(), 100);
        }
        initSetting();
    }

    function click(index) {
        if (!welcomeLayerClosed) return;
        let p = _gameBBList[_gameBBListIndex];
        let base = parseInt($(`#${p.id}`).attr("num")) - p.cell;
        let num = base + index - 1;
        let id = p.id.substring(0, 11) + num;
        let fakeEvent = {
            clientX: ((index - 1) * blockSize + index * blockSize) / 2 + body.offsetLeft,
            clientY: (touchArea[0] + touchArea[1]) / 2,
            target: document.getElementById(id),
        };
        gameTapEvent(fakeEvent);
    }

    const clickBeforeStyle = $('<style></style>');
    const clickAfterStyle = $('<style></style>');
    const catClickBeforeStyle = $('<style></style>');
    const catClickAfterStyle = $('<style></style>');
    clickBeforeStyle.appendTo($(document.head));
    clickAfterStyle.appendTo($(document.head));
    catClickBeforeStyle.appendTo($(document.head));
    catClickAfterStyle.appendTo($(document.head));
    catClickBeforeStyle.html('.c1, .c2, .c3, .c4, .c5 { background-size: 100% 100%; background-image: url(./img/before.webp); }');
    catClickAfterStyle.html('.cc1, .cc2, .cc3, .cc4, .cc5 { background-size: auto 86%; background-image: url(./img/after.webp); }');

    const catFailStyle = $('<style></style>');
    catFailStyle.appendTo($(document.head));
    catFailStyle.html('body.cat-mode .flash, body.cat-mode .bad { background: url(./img/不等了_nobg.webp) no-repeat center !important; background-size: contain !important; }');

    function saveImage(dom, callback) {
        if (dom.files && dom.files[0]) {
            let reader = new FileReader();
            reader.onload = function() { callback(this.result); }
            reader.readAsDataURL(dom.files[0]);
        }
    }

    w.getClickBeforeImage = function() { $('#click-before-image').click(); }
    w.saveClickBeforeImage = function() {
        const img = document.getElementById('click-before-image');
        saveImage(img, r => {
            clickBeforeStyle.html(`.t1, .t2, .t3, .t4, .t5 { background-size: auto 100%; background-image: url(${r}); }`);
        })
    }

    w.getClickAfterImage = function() { $('#click-after-image').click(); }
    w.saveClickAfterImage = function() {
        const img = document.getElementById('click-after-image');
        saveImage(img, r => {
            clickAfterStyle.html(`.tt1, .tt2, .tt3, .tt4, .tt5 { background-size: auto 86%; background-image: url(${r}); }`);
        })
    }
})(window);
