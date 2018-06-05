(function(window, undefined) {
        var htmlElement = function(el) {
            this.el = el;
            this.listeners = {}
        };
        htmlElement.prototype = {};
        htmlElement.prototype.el = null;
        htmlElement.prototype.findByTagName = function(tagName) {
            var el = this.el.getElementsByTagName(tagName);
            var result = [];
            for (var i = 0; i < el.length; i++) result.push(new htmlElement(el[i]));
            return result
        };
        htmlElement.prototype.createElement = function(tagName) {
            var el = document.createElement(tagName);
            return el ? new htmlElement(el) : null
        };
        htmlElement.prototype.remove = function() {
            this.el.parentNode.removeChild(this.el)
        };
        htmlElement.prototype.addEventListener = function(eventName, fn) {
            if (!this.listeners[eventName]) this.listeners[eventName] = [];
            var callBack = function(e) {
                var r = fn(e);
                if (r === false) e.preventDefault ? e.preventDefault() : e.returnValue = false;
                return r
            };
            this.listeners[eventName].push(callBack);
            if (this.el.addEventListener) this.el.addEventListener(eventName, callBack);
            else if (this.el.attachEvent) this.el.attachEvent('on' + eventName, callBack);
            return this
        };
        htmlElement.prototype.style = function(name, value) {
            var self = this;
            var el = this.el;
            if (typeof name == 'object') {
                Obj.each(name, function(style, value) {
                    self.style(style, value)
                });
                return true
            } else {
                if (typeof this.el.style[name] == 'undefined') return null;
                if (typeof value != 'undefined') el.style[name] = value ? value : '';
                return el.style[name]
            }
        };
        htmlElement.prototype.append = function(child) {
            if (!child) return false;
            this.el.appendChild(child.el);
            return true
        };
        htmlElement.prototype.prepend = function(child) {
            if (!child) return false;
            var firstChild = this.el.firstChild;
            if (firstChild) this.el.insertBefore(child.el, firstChild);
            else this.append(child);
            return true
        };
        htmlElement.prototype.attr = function(name, value) {
            if (typeof value != 'undefined') this.el.setAttribute(name, value);
            return this.el.getAttribute(name)
        };
        htmlElement.prototype.removeAttr = function(name) {
            return this.el.removeAttribute(name)
        };
        htmlElement.prototype.prop = function(name, value) {
            if (typeof value != 'undefined' && typeof this.el[name] != 'undefined') this.el[name] = value;
            return this.el[name]
        };
        htmlElement.prototype.addClass = function(values) {
            var elClass = this.el.className;
            var i, j, find;
            if (values instanceof Array) {
                for (i = 0; i < values.length; i++) this.addClass(values[i]);
                return true
            }
            values = values.split(/\s+/);
            elClass = elClass.split(/\s+/);
            for (i = 0; i < values.length; i++) {
                find = false;
                for (j = 0; j < elClass.length; j++) {
                    if (values[i] == elClass[j]) {
                        find = true;
                        break
                    }
                }
                if (!find) elClass.push(values[i])
            }
            this.el.className = elClass.join(' ').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            return true
        };
        htmlElement.prototype.removeClass = function(values) {
            var elClass = this.el.className;
            var i, j;
            if (values instanceof Array) {
                for (i = 0; i < values.length; i++) this.removeClass(values[i]);
                return true
            }
            values = values.split(/\s+/);
            elClass = elClass.split(/\s+/);
            for (i = 0; i < values.length; i++) {
                for (j = 0; j < elClass.length; j++) {
                    if (values[i] == elClass[j]) {
                        elClass.splice(j, 1)
                    }
                }
            }
            this.el.className = elClass.join(' ').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            return true
        };
        htmlElement.prototype.html = function(data) {
            if (typeof data != 'undefined') this.el.innerHTML = data;
            return this.el.innerHTML
        };
        htmlElement.prototype.firstChild = function() {
            var el = this.el.firstChild;
            return el ? new htmlElement(el) : null
        };
        htmlElement.prototype.requestFullscreen = function() {
            var self = this;
            var fn = ['requestFullscreen', 'msRequestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'];
            for (var i = 0; i < fn.length; i++) {
                if (this.el[fn[i]]) {
                    this.el[fn[i]]();
                    return true
                }
            }
            window.top.postMessage('request-full-screen', '*');
            return true
        };
        htmlElement.prototype.exitFullscreen = function() {
            var fn = ['exitFullscreen', 'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'];
            for (var i = 0; i < fn.length; i++) {
                if (htmlDocument.el[fn[i]]) {
                    htmlDocument.el[fn[i]]();
                    return true
                }
            }
            window.top.postMessage('exit-full-screen', '*');
            return false
        };
        htmlElement.prototype.fullscreenElement = function() {
            var name = ['fullscreenElement', 'mozFullScreenElement', 'webkitFullscreenElement', 'msFullscreenElement'];
            for (var i = 0; i < name.length; i++) {
                if (typeof htmlDocument.el[name[i]] != 'undefined') {
                    var el = htmlDocument.el[name[i]];
                    return el ? htmlElement(el) : null
                }
            }
        };
        var htmlDocument = new htmlElement(document);
        var Obj = {};
        Obj.each = function(o, callback) {
            var k;
            if (o instanceof Array)
                for (k = 0; k < o.length; k++) callback(k, o[k]);
            else if (o instanceof Object)
                for (k in o)
                    if (o.hasOwnProperty(k)) callback(k, o[k])
        };
        Obj.create = function(o) {
            return this.extend({}, o)
        };
        Obj.extend = function(o1, o2) {
            var res = {},
                o = [],
                i;
            if ((o1 instanceof Array) && (typeof o2 == 'undefined')) o = o1;
            else o = [o1, o2];
            for (i = 0; i < o.length; i++) {
                if (o[i]) {
                    this.each(o[i], function(key, val) {
                        if (typeof res[key] != 'undefined' && res[key] instanceof Object && val instanceof Object && !res[key] instanceof Array && !val instanceof Array) {
                            res[key] = Obj.extend(res[key], val)
                        } else {
                            if (typeof res[key] == 'undefined' || typeof val != 'undefined') res[key] = val
                        }
                    })
                }
            }
            return res
        };
        var _video = function() {
            this.events = {};
            this.options = {}
        };
        _video.prototype = {};
        _video.prototype.events = {};
        _video.prototype.htmlElement = null;
        _video.prototype.on = function(eventName, fn) {
            if (typeof this.events[eventName] === 'undefined') this.events[eventName] = [];
            this.events[eventName].push(fn)
        };
        _video.prototype.event = function(eventName) {
            var i, result = true,
                r;
            if (typeof this.events[eventName] === 'undefined') return result;
            for (i = 0; i < this.events[eventName].length; i++) {
                r = this.events[eventName][i]();
                if (typeof r !== 'undefined') result = result && r
            }
            return result
        };
        _video.prototype.setOptions = function(options) {
            this.options = Obj.extend(this.options, options)
        };
        _video.prototype.mimeTypes = {
            mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
            ogv: 'video/ogg; codecs="theora, vorbis"',
            webm: 'video/webm; codecs="vp8, vorbis"',
            flv: 'video/x-flv'
        };
        var videoHtml = function(options) {
            this.events = {};
            this.options = {
                className: 'video-player-video'
            };
            this.setOptions(options);
            this.init()
        };
        videoHtml.prototype = new _video();
        videoHtml.prototype.support = function(format) {
            var mime = this.mimeTypes[format];
            if (!mime) return false;
            var video = document.createElement('video');
            if (!video || !video.canPlayType) return false;
            return !!video.canPlayType(mime)
        };
        videoHtml.prototype.init = function() {
            this.htmlElement = this.createVideo();
            this.event('ready')
        };
        videoHtml.prototype.destroy = function() {
            this.events = {}
        };
        videoHtml.prototype.createVideo = function() {
            var self = this;
            var video;
            video = htmlDocument.createElement('video');
            video.attr('src', this.options.videoSrc);
            video.attr('preload', 'none');
            video.attr('playsinline', 'playsinline');
            video.attr('webkit-playsinline', 'webkit-playsinline');
            video.addClass(this.options.className);
            var bindEvent = function(eventName) {
                video.addEventListener(eventName, function() {
                    return self.event(eventName)
                })
            };
            var events = ['ended', 'playing', 'waiting', 'volumechange', 'play', 'seeked', 'pause'];
            for (var i = 0; i < events.length; i++) bindEvent(events[i]);
            return video
        };
        videoHtml.prototype.property = function(name, value) {
            return this.htmlElement.prop(name, value)
        };
        videoHtml.prototype.play = function() {
            return this.htmlElement.el.play()
        };
        videoHtml.prototype.pause = function() {
            return this.htmlElement.el.pause()
        };
        videoHtml.prototype.stop = function() {
            this.pause();
            this.currentTime(0)
        };
        videoHtml.prototype.paused = function() {
            return this.property('paused')
        };
        videoHtml.prototype.muted = function(value) {
            return this.property('muted', value)
        };
        videoHtml.prototype.volume = function(value) {
            return this.property('volume', value)
        };
        videoHtml.prototype.currentTime = function(value) {
            return this.property('currentTime', value)
        };
        videoHtml.prototype.duration = function() {
            return this.property('duration') || 0
        };
        /******** THERE FUNCTION FLASH PLAYER *****************/
        var videoDownload = function(options) {
            this.events = {};
            this.options = {
                className: 'video-player-video'
            };
            this.setOptions(options);
            this.init();
            this.event('ready')
        };
        videoDownload.prototype = new _video();
        videoDownload.prototype.mutedVal = false;
        videoDownload.prototype.volumeVal = 1;
        videoDownload.prototype.support = function() {
            return true
        };
        videoDownload.prototype.init = function() {
            this.htmlElement = this.createDiv()
        };
        videoDownload.prototype.destroy = function() {
            this.events = {}
        };
        videoDownload.prototype.createDiv = function() {
            var div = htmlDocument.createElement('div');
            div.addClass(this.options.className);
            return div
        };
        videoDownload.prototype.download = function() {
            if (this.event('download') !== false) window.top.location.href = this.options.videoSrc
        };
        videoDownload.prototype.play = function() {
            this.download()
        };
        videoDownload.prototype.pause = function() {
            return false
        };
        videoDownload.prototype.paused = function() {
            return true
        };
        videoDownload.prototype.stop = function() {
            return false
        };
        videoDownload.prototype.muted = function(value) {
            if (typeof value != 'undefined') {
                this.mutedVal = !!value;
                this.event('volumechange')
            }
            return this.mutedVal
        };
        videoDownload.prototype.volume = function(value) {
            if (typeof value != 'undefined') {
                value = parseFloat(value);
                if (value > 1) value = 1;
                this.volumeVal = value;
                this.event('volumechange')
            }
            return this.volumeVal
        };
        videoDownload.prototype.currentTime = function() {
            return 0
        };
        videoDownload.prototype.duration = function() {
            return 0
        };
        var poster = function(options) {
            this.options = {
                'className': 'video-player-poster',
                'src': null
            };
            this.setOptions(options);
            this.init()
        };
        poster.prototype = {};
        poster.prototype.htmlElement = null;
        poster.prototype.setOptions = function(options) {
            this.options = Obj.extend(this.options, options)
        };
        poster.prototype.init = function() {
            var el = htmlDocument.createElement('div');
            el.style('backgroundImage', 'url(' + this.options.src + ')');
            el.addClass(this.options.className);
            this.htmlElement = el
        };
        poster.prototype.destroy = function() {};
        poster.prototype.hide = function() {
            this.htmlElement.style('display', 'none')
        };
        poster.prototype.show = function() {
            this.htmlElement.style('display', '')
        };
        var controls = function(player) {
            this.player = player;
            this.init()
        };
        controls.prototype = {};
        controls.prototype.player = null;
        controls.prototype.controls_types = ['play-pause', 'progress-bar', 'mute', 'volume', 'time-inverse', 'full-screen', 'quality'];
        controls.prototype.init = function() {
            var self = this;
            var controls = this.findControls();
            var player = this.player;
            var i;
            this.hideControlsTimeout = null;
            this.initWaiting();
            this.hideOnMosemove();
            for (i = 0; i < controls.length; i++) this.initControl[controls[i].type](player, controls[i].htmlElement, this)
        };
        controls.prototype.destroy = function() {};
        controls.prototype.hideControls = function() {
            var self = this;
            var player = this.player;
            if (self.hideControlsTimeout) {
                clearTimeout(self.hideControlsTimeout);
                self.hideControlsTimeout = null
            }
            if (!player.paused()) self.hideControlsTimeout = setTimeout(function() {
                player.htmlElement.attr('no-controls', 'no-controls');
                self.hideControlsTimeout = null
            }, 2000)
        };
        controls.prototype.showControls = function() {
            var self = this;
            var player = this.player;
            if (self.hideControlsTimeout) {
                clearTimeout(self.hideControlsTimeout);
                self.hideControlsTimeout = null
            }
            setTimeout(function() {
                player.htmlElement.removeAttr('no-controls')
            }, 0)
        };
        controls.prototype.controlsVisible = function() {
            var self = this;
            var player = this.player;
            return !(player.htmlElement.attr('no-controls') == 'no-controls')
        };
        controls.prototype.hideOnMosemove = function() {
            var player = this.player;
            var self = this;
            var timeout = null;
            hide = function() {
                self.hideControls()
            };
            show = function() {
                self.showControls()
            };
            player.on('play', hide);
            player.on('pause', show);
            player.on('ready', show);
            player.htmlElement.addEventListener('mousemove', function() {
                show();
                hide()
            });
            return true
        };
        controls.prototype.initWaiting = function() {
            var player = this.player;
            player.on('waiting', function() {
                player.htmlElement.attr('waiting', 'waiting')
            });
            player.on('playing', function() {
                player.htmlElement.removeAttr('waiting')
            })
        };
        controls.prototype.findControls = function() {
            var elements = this.player.htmlElement.findByTagName('*');
            var i, k, data;
            var controls = [];
            for (i = 0; i < elements.length; i++) {
                data = elements[i].attr('data-control');
                if (data) {
                    for (k = 0; k < this.controls_types.length; k++) {
                        if (data == this.controls_types[k]) {
                            controls.push({
                                type: data,
                                htmlElement: elements[i]
                            })
                        }
                    }
                }
            }
            return controls
        };
        controls.prototype.initControl = {
            'play-pause': function(player, htmlElement) {
                var updateState = function() {
                    var playing = player.paused() ? 'paused' : 'playing';
                    htmlElement.attr('playing', playing)
                };
                var touch = false;
                htmlElement.addEventListener('touchstart', function(e) {
                    touch = true
                });
                htmlElement.addEventListener('click', function(e) {
                    if (touch && !player.controls.controlsVisible()) {
                        player.controls.showControls();
                        player.controls.hideControls()
                    } else {
                        player.playingToggle()
                    }
                    touch = false
                });
                player.on('play', updateState);
                player.on('pause', updateState);
                player.on('ready', updateState);
                updateState()
            },
            'progress-bar': function(player, htmlElement) {
                var valueElement = htmlElement.findByTagName('span')[0];
                var updateState = function() {
                    //console.log(">>>"+player.currentTime()+"<<<<<");
                    //self.player.exitFullScreen();
                    //showPopup(self.options.film_id);
                    /******************************************/
                    //player.exitFullScreen();
                    //window.top.postMessage('plugin-register', '*');
                    //player.showPopup(player.options.film_id);

                    //console.log(player);
                    /******************************************/
                    var currentTime = player.currentTime();
                    var duration = player.duration();
                    var progress = duration ? (currentTime / duration * 100) : 0;
                    valueElement.style('width', progress + '%')
                };

                player.on('timeupdate', updateState);
                player.on('seeked', updateState);
                player.on('ready', updateState);
                updateState()
            },
            'mute': function(player, htmlElement) {
                var updateState = function() {
                    player.muted() ? htmlElement.attr('muted', 'muted') : htmlElement.removeAttr('muted')
                };
                htmlElement.addEventListener('click', function() {
                    player.mutedToggle()
                });
                player.on('volumechange', updateState);
                player.on('ready', updateState);
                updateState()
            },
            'volume': function(player, htmlElement) {
                var valueElement = htmlElement.findByTagName('span')[0];
                var updateState = function() {
                    var volume = player.volume() * 100;
                    valueElement.style('width', volume + '%');
                    player.muted() ? htmlElement.attr('muted', 'muted') : htmlElement.removeAttr('muted')
                };
                var pressed = false;
                var setVolume = function(e) {
                    var x = typeof e.offsetX == 'undefined' ? e.layerX : e.offsetX;
                    var volume = Math.round(x / htmlElement.el.offsetWidth * 10) / 10;
                    player.muted(volume == 0);
                    if (volume > 0) player.volume(volume)
                };
                htmlElement.addEventListener('mousemove', function(e) {
                    if (pressed) setVolume(e)
                });
                htmlElement.addEventListener('mouseup', setVolume);
                htmlElement.addEventListener('mousedown', function(e) {
                    pressed = true;
                    setVolume(e)
                });
                htmlDocument.addEventListener('mouseup', function(e) {
                    pressed = false
                });
                player.on('volumechange', updateState);
                player.on('ready', updateState);
                updateState()
            },
            'time-inverse': function(player, htmlElement) {
                var updateState = function() {
                    var currentTime = player.currentTime();
                    var duration = player.duration();
                    var time = Math.ceil(duration ? (duration - currentTime) : 0);
                    var hours = Math.floor(time / 3600);
                    time = time % 3600;
                    var minutes = Math.floor(time / 60);
                    time = time % 60;
                    var seconds = time;
                    var intToStr = function(int) {
                        return '' + (int < 10 ? '0' : '') + int
                    };
                    htmlElement.html('<i>' + (hours ? (hours + ':') : '') + (intToStr(minutes)) + ':' + (intToStr(seconds)) + '</i>')
                };
                player.on('timeupdate', updateState);
                player.on('ready', updateState);
                updateState()
            },
            'full-screen': function(player, htmlElement, self) {
                htmlElement.addEventListener('click', function() {
                    if (self.fullScreenEnabled()) self.exitFullScreen();
                    else self.fullScreen()
                });
                var onFullScreenChange = function() {
                    if (typeof htmlDocument.fullscreenElement() != 'undefined') self.exitFullScreen()
                };
                htmlDocument.addEventListener('fullscreenchange', onFullScreenChange);
                htmlDocument.addEventListener('webkitfullscreenchange', onFullScreenChange);
                htmlDocument.addEventListener('mozfullscreenchange', onFullScreenChange);
                htmlDocument.addEventListener('MSFullscreenChange', onFullScreenChange)
            },
            'quality': function(player, htmlElement, self) {
                htmlElement.addEventListener('click', function() {
                    if (htmlElement.attr('quality') == 'sd') htmlElement.attr('quality', 'hd');
                    else htmlElement.attr('quality', 'sd')
                })
            }
        };
        controls.prototype.fullScreen = function() {
            this.player.htmlElement.attr('full-screen', 'full-screen');
            this.player.htmlElement.requestFullscreen();
            return true
        };
        controls.prototype.exitFullScreen = function() {
            this.player.htmlElement.removeAttr('full-screen');
            htmlDocument.exitFullscreen();
            return true
        };
        controls.prototype.fullScreenEnabled = function() {
            return this.player.htmlElement.attr('full-screen') != null
        };
        var player = function(container, options) {
            this.events = {};
            this.options = {
                className: 'video-player',
                //tech: ['html', 'flash', 'download']
                tech: ['html', 'download']
            };
            this.htmlElement = container;
            this.setOptions(options);
            this.init()
        };
        player.prototype = new _video();
        player.prototype.drivers = {
            'html': videoHtml,
            //'flash': videoFlash,
            'download': videoDownload
        };
        player.prototype.video = null;
        player.prototype.poster = null;
        player.prototype.controls = null;
        player.prototype.init = function() {
            this.video = this.createVideo();
            this.poster = this.createPoster();
            this.bindEvents();
            this.htmlElement.prepend(this.video.htmlElement);
            this.htmlElement.prepend(this.poster.htmlElement);
            this.htmlElement.addClass(this.options.className);
            if (this.options.controls) this.controls = new controls(this)
        };
        player.prototype.update = function(options) {
            this.setOptions(options);
            var muted = this.muted();
            var volume = this.volume();
            this.video.htmlElement.remove();
            this.poster.htmlElement.remove();
            this.video.destroy();
            this.poster.destroy();
            this.video = this.createVideo();
            this.poster = this.createPoster();
            this.bindEvents();
            this.htmlElement.prepend(this.video.htmlElement);
            this.htmlElement.prepend(this.poster.htmlElement);
            this.muted(muted);
            this.volume(volume);
            this.event('ready')
        };
        player.prototype.destroy = function() {
            this.video.htmlElement.remove();
            this.poster.htmlElement.remove();
            clearInterval(this.timeUpdateInterval);
            this.video.destroy();
            this.poster.destroy();
            this.controls.destroy();
            this.events = {};
            players.remove(this.options.id)
        };
        player.prototype.createVideo = function() {
            var driver, i, j, src;
            for (i = 0; i < this.options.tech.length; i++) {
                driver = this.drivers[this.options.tech[i]];
                for (j = 0; j < this.options.video.src.length; j++) {
                    src = this.options.video.src[j];
                    if (driver.prototype.support(src.format)) {
                        return new driver({
                            playerId: this.options.id,
                            //swfPath: this.options.swfPath,
                            className: this.options.video.className,
                            videoSrc: src.url
                        })
                    }
                }
            }
            return null
        };
        player.prototype.createPoster = function() {
            return new poster({
                'className': this.options.poster.className,
                'src': this.options.poster.src
            })
        };
        player.prototype.hidePoster = function() {
            return this.poster.hide()
        };
        player.prototype.showPoster = function() {
            return this.poster.show()
        };
        player.prototype.bindEvents = function() {
            var self = this;
            var events = ['ended', 'playing', 'waiting', 'volumechange', 'play', 'seeked', 'pause', 'download', 'ready'];
            Obj.each(events, function(i, event) {
                self.video.on(event, function() {
                    return self.event(event)
                })
            });
            self.timeUpdateInterval = null;
            var timeUpdate = function() {
                self.event('timeupdate')
            };
            var timeUpdateStart = function() {
                timeUpdateStop();

                self.timeUpdateInterval = setInterval(function() {
                    timeUpdate()
                }, 250);
            };
            var timeUpdateStop = function() {
                if (self.timeUpdateInterval) clearInterval(self.timeUpdateInterval)
            };
            self.on('play', function() {
                self.hidePoster();
                timeUpdateStart()
            });
            self.on('pause', function() {
                timeUpdateStop()
            });
            self.on('playing', function() {
                timeUpdateStart()
            });
            self.on('waiting', function() {
                timeUpdateStop()
            });
            self.on('seeked', function() {
                timeUpdate()
            });
            self.on('ended', function() {
                timeUpdateStop();
                self.stop()
            })
        };
        player.prototype.play = function() {
            return this.video.play()
        };
        player.prototype.pause = function() {
            return this.video.pause()
        };
        player.prototype.stop = function() {
            this.video.stop();
            this.showPoster();
            return true
        };
        player.prototype.fullScreen = function() {
            if (!this.controls) return false;
            this.controls.fullScreen();
            return true
        };
        player.prototype.exitFullScreen = function() {
            if (!this.controls) return false;
            this.controls.exitFullScreen();
            return true
        };
        player.prototype.playingToggle = function() {
            return this.paused() ? this.play() : this.pause()
        };
        player.prototype.paused = function() {
            return this.video.paused()
        };
        player.prototype.muted = function(value) {
            value = (typeof value != 'undefined') ? !!value : value;
            return this.video.muted(value)
        };
        player.prototype.mutedToggle = function() {
            return this.muted(!this.muted())
        };
        player.prototype.volume = function(value) {
            if (typeof value != 'undefined') {
                value = parseFloat(value);
                value = (value < 0) ? 0 : (value > 1 ? 1 : value)
            }
            return this.video.volume(value)
        };
        player.prototype.currentTime = function(value) {
            var duration, currentTime;
            if (typeof value != 'undefined') {
                value = parseFloat(value);
                duration = this.duration();
                currentTime = this.currentTime();
                value = (value < 0) ? 0 : (value > duration ? duration : value);
                value = value == currentTime ? undefined : value
            }
            return this.video.currentTime(value)
        };

        player.prototype.duration = function() {
            if (typeof this.options.duration != 'undefined') return parseInt(this.options.duration);
            else return this.video.duration()
        };
        var players = {};
        players._id = 0;
        players.players = {};
        players.id = function() {
            this._id++;
            return this._id
        };
        players.add = function(id, player) {
            this.players[id] = player;
            return player
        };
        players.get = function(id) {
            return this.players[id]
        };
        players.remove = function(id) {
            return delete this.players[id]
        };
        window.videoPlayer = function(container, options) {
            var id = players.id();
            var pl = new player(new htmlElement(container), Obj.extend(options, {
                id: id
            }));
            players.add(id, pl);
            return pl
        }
    })(window);

    var addClass = function(el, values) {
        var elClass = el.className;
        var i, j, find;
        values = values.split(/\s+/);
        elClass = elClass.split(/\s+/);
        for (i = 0; i < values.length; i++) {
            find = false;
            for (j = 0; j < elClass.length; j++) {
                if (values[i] == elClass[j]) {
                    find = true;
                    break
                }
            }
            if (!find) elClass.push(values[i])
        }
        el.className = elClass.join(' ').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        return true
    };
    removeClass = function(el, values) {
        var elClass = el.className;
        var i, j;
        values = values.split(/\s+/);
        elClass = elClass.split(/\s+/);
        for (i = 0; i < values.length; i++) {
            for (j = 0; j < elClass.length; j++) {
                if (values[i] == elClass[j]) {
                    elClass.splice(j, 1)
                }
            }
        }
        el.className = elClass.join(' ').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        return true
    };

    var timer_to_registration;
    var fadeOutEl = false;
    var fadeInEl = false;

    var mWidget = {
        options: {},
        player: null,
        init: function(options) {
            var self = this;
            self.options = options;
            self.initPlayer(options.video);
            self.initPlaylist();
            this.preventSelection(document)
        },
        initPlayer: function(video_options) {
            var self = this;
            var player = document.getElementById('player');
            var get_title_cont = function() {
                var els = player.getElementsByTagName('span');
                var title = [];
                for (var i = 0; i < els.length; i++) {
                    var el = els[i];
                    if (el.className.indexOf('title') >= 0) title.push(el)
                }
                return title
            };
            var get_film_name_cont = function() {
                var els = player.getElementsByTagName('span');
                for (var i = 0; i < els.length; i++) {
                    var el = els[i];
                    if (el.className.indexOf('film-name') >= 0) return el
                }
            };
            var get_film_original_name_cont = function() {
                var els = player.getElementsByTagName('span');
                for (var i = 0; i < els.length; i++) {
                    var el = els[i];
                    if (el.className.indexOf('film-original-name') >= 0) return el
                }
            };
            var get_episode_cont = function() {
                var els = player.getElementsByTagName('span');
                for (var i = 0; i < els.length; i++) {
                    var el = els[i];
                    if (el.className.indexOf('episode') >= 0) return el
                }
            };
            var get_time_to_reg = function(){
                var timerStop = video_options.time_to_reg;
                if(timerStop){
                    return timerStop;
                } else {
                    return self.options.time_to_reg;
                }
            }
            player.setAttribute('status', 'preview');

            timer_to_registration = get_time_to_reg();

            var optionCurrenTtimer = false;
            var optionWapChecking = false;

            if (!self.player) {
                var play_video = !self.options.skip_video;
                //var play_video = self.options.skip_video;
                //console.log(play_video);
                //var play_video = false; //без видеовставки

                var agent = self.agent();
                if (agent.os.name == 'ios') {
                    addClass(player, 'controls-volume-hidden');
                    if (agent.os.version.major <= 9 && agent.device != 'ipad') {
                        play_video = false
                    }
                }
                self.player = videoPlayer(player, {
                    tech: play_video ? ['html', 'download'] : ['download'],
                    controls: true,
                    duration: video_options.duration,
                    video: {
                        'src': [{
                            'url': video_options.src,
                            'format': video_options.format
                        }]
                    },
                    poster: {
                        'src': video_options.poster_src
                    }
                });
                
                self.player.on('play', function() {
                    optionCurrenTtimer = true;
                    player.setAttribute('status', 'playing')
                });
                self.player.on('pause', function() {
                    optionCurrenTtimer = false;
                    player.setAttribute('status', 'paused')
                });

                if (!self.options.registered) {
                    var timerUp = function(){
                        var el = document.querySelector('.title');
                        var a = self.player.currentTime();
                        console.log("current: " + a);
                        if (!self.options.hide_name) {
                            if(a > 3){  
                                if(a < 7){ 
                                    if(!fadeInEl){ fadeInEl = true; fadeIn(el); }
                                } else {
                                    if(!fadeOutEl) { fadeOutEl = true; fadeOut(el); }
                                } 
                            }
                        }
                        if(a > timer_to_registration){ a = 'stop';}
                        return a;
                    }
                    var showPopup = function(film_id) {
                        // ОТКРЫТЬ ОКНО РЕГИСТРАЦИИ
                        window.top.postMessage('plugin-register', '*');
                    };
                    var stopTimepopup = function(){
                        if(optionCurrenTtimer){
                            setTimeout(function(){
                                var c = timerUp();
                                if(c == 'stop'){
                                    self.player.exitFullScreen();
                                    self.player.stop();
                                    showPopup(self.options.film_id);
                                    return false
                                } else {
                                    stopTimepopup();
                                }
                            },1000);
                        }
                    };
                    var videoStarted = function(film_id) {
                        if(!optionWapChecking){
                            optionWapChecking = true;
                            //Проверить вап 
                        }
                        stopTimepopup();
                        //alert("WAPPAYMENT");
                        // ПРОВЕРИТЬ ВАП ЕСЛИ НОРМАЛЬНО ВСЕ _ ПРОДОЛЖИТЬ ПРОСМОТР
                    };
                    self.player.on('play', function() {
                        videoStarted(self.options.film_id);
                    });
                    self.player.on('download', function() {
                        optionCurrenTtimer = false;
                        //ЗАПУСК ОКНА РЕГИСТРАЦИИ
                        self.player.exitFullScreen();
                        showPopup(self.options.film_id);
                        return false
                    });
                    self.player.on('ended', function() {
                        optionCurrenTtimer = false;
                        //ЕСЛИ ЗАКОНЧИЛОСЬ ВИДЕО ЗАПУСТИТЬ РЕГИСТРАЦИЮ;
                        self.player.exitFullScreen();
                        showPopup(self.options.film_id)
                    })
                } else {
                    var showMagnetLinks = document.getElementById('magnet-links');
                    showMagnetLinks.style.display = 'block';

                }
                self.player.volume(0.7)
            } else {
                self.player.update({
                    video: {
                        'src': [{
                            'url': video_options.src,
                            'format': video_options.format
                        }]
                    },
                    poster: {
                        'src': video_options.poster_src
                    }
                })
            }

            var film_name_cont = get_film_name_cont();
            var episode_cont = get_episode_cont();


            film_name_cont.innerHTML = '<i>' + video_options.name + '</i>';
            episode_cont.innerHTML = '<i class="s">' + video_options.season + ' сезон</i><i class="e">' + video_options.episode + '</i>';
            
        },
        initPlaylist: function() {
            var self = this;
            var playlist = document.getElementById('playlist');
            if (!playlist) return false;
            var items = playlist.getElementsByTagName('a');
            var i = 0;
            for (i = 0; i < items.length; i++) {
                if (items[i].className.indexOf('headerSeason') >= 0) {
                    //РАСКРЫТЬ СЕРИИ
                    items[i].onclick = function() {
                        var currentItem = this.getAttribute('data-season');
                        var a = document.getElementsByName("open"+currentItem);
                        if(a[0].style.display == 'block'){ var typeDisplay = 'none';} else { var typeDisplay = 'block';}
                        for (c = 0; c < a.length; c++) {
                            a[c].style.display=typeDisplay;
                        }
                    }
                } else {
                    items[i].onclick = function() {
                        var options = {
                            name: self.options.video.name,
                            original_name: self.options.video.original_name,
                            season: this.getAttribute('data-season-num'),
                            episode: this.getAttribute('data-episode-num'),
                            duration: parseInt(this.getAttribute('data-duration')),
                            src: this.getAttribute('data-video-url'),
                            format: 'mp4',
                            poster_src: this.getAttribute('data-image-url'),
                            time_to_reg: this.getAttribute('data-time-to-reg')
                        };

                        timer_to_registration = this.getAttribute('data-time-to-reg');
                        var eltitle = document.querySelector('.title');
                        eltitle.style.display = "none";
                        fadeOutEl = false;
                        fadeInEl = false;

                        optionCurrenTtimer = false;


                        self.initPlayer(options);
                        for (var k = 0; k < items.length; k++) {
                            if (items[k] != this) removeClass(items[k], 'selected')
                        }
                        addClass(this, 'selected');
                        // Если кникнута серия - скрыть плейлист запустить видео.
                        AnimateClose();
                        self.player.play();

                    };
                    if (items[i].className.indexOf('selected') >= 0) {
                        alert();
                        playlist.scrollTop = items[i].offsetTop - Math.round((playlist.clientHeight - items[i].clientHeight) * 0.5);
                        playlist.scrollLeft = items[i].offsetLeft - Math.round((playlist.clientWidth - items[i].clientWidth) * 0.5)
                    }
                }
            }
            var scroll = {
                scroll: null,
                bar: null,
                orientation: null
            };
            var d = playlist.getElementsByTagName('div');
            for (i = 0; i < d.length; i++) {
                if (d[i].className.replace(/\s+/, '') == 'scroll') {
                    scroll.scroll = d[i];
                    scroll.bar = d[i].parentNode;
                    scroll.orientation = scroll.bar.clientWidth < scroll.bar.clientHeight ? 'vertical' : 'horizontal';
                    break
                }
            }

            var calcScrollSize = function() {
                if (!scroll.scroll) {
                    scroll.bar.style.display = 'none';
                    return false
                } else {
                    scroll.bar.style.display = 'block'
                }
                var calcVertical = function() {
                    var height = playlist.clientHeight / playlist.scrollHeight * 100;
                    if (height == 100) return false;
                    if (height < 10) height = 10;
                    scroll.scroll.style.height = height + '%';
                    var top = playlist.scrollTop / (playlist.scrollHeight - playlist.clientHeight) * (100 - height);
                    if (100 - top < height) top = 100 - height;
                    scroll.scroll.style.top = top + '%';
                    return true
                };
                var calcHorisontal = function() {
                    var width = playlist.clientWidth / playlist.scrollWidth * 100;
                    if (width == 100) return false;
                    if (width < 10) width = 10;
                    scroll.scroll.style.width = width + '%';
                    var left = playlist.scrollLeft / (playlist.scrollWidth - playlist.clientWidth) * (100 - width);
                    if (100 - left < width) left = 100 - width;
                    scroll.scroll.style.left = left + '%';
                    return true
                };
                if (scroll.orientation == 'horizontal') {
                    if (calcHorisontal()) {
                        scroll.bar.style.display = 'block';
                        return true
                    } else {
                        scroll.bar.style.display = 'none';
                        return false
                    }
                } else {
                    if (calcVertical()) {
                        scroll.bar.style.display = 'block';
                        return true
                    } else {
                        scroll.bar.style.display = 'none';
                        return false
                    }
                }
            };
            calcScrollSize();
            var hideScrollInterval = null;
            var showScroll = function() {
                if (!calcScrollSize()) return false;
                if (hideScrollInterval) clearInterval(hideScrollInterval);
                scroll.scroll.style.display = 'block';
                hideScrollInterval = setInterval(function() {
                    scroll.scroll.style.display = 'none'
                }, 700)
            };
            var scrollParams = {
                scrollTop: 0,
                scrollLeft: 0,
                interval: null,
                scrollTopStep: 0,
                scrollLeftStep: 0,
                steps_c: 7,
                minScrollStep: 5
            };
            var scrollPlaylist = function(scrollTop, scrollLeft) {
                if (scrollParams.interval) clearInterval(scrollParams.interval);
                scrollParams.scrollTop += scrollTop;
                scrollParams.scrollLeft += scrollLeft;
                scrollParams.scrollTopStep = scrollParams.scrollTop / scrollParams.steps_c;
                scrollParams.scrollLeftStep = scrollParams.scrollLeft / scrollParams.steps_c;
                scrollParams.scrollTopStep = scrollParams.scrollTopStep > 0 ? Math.ceil(scrollParams.scrollTopStep) : Math.floor(scrollParams.scrollTopStep);
                scrollParams.scrollLeftStep = scrollParams.scrollLeftStep > 0 ? Math.ceil(scrollParams.scrollLeftStep) : Math.floor(scrollParams.scrollLeftStep);
                if (Math.abs(scrollParams.scrollTopStep) < scrollParams.minScrollStep) scrollParams.scrollTopStep = scrollParams.minScrollStep * (scrollParams.scrollTopStep < 0 ? (-1) : 1);
                if (Math.abs(scrollParams.scrollLeftStep) < scrollParams.minScrollStep) scrollParams.scrollLeftStep = scrollParams.minScrollStep * (scrollParams.scrollLeftStep < 0 ? (-1) : 1);
                var scrl = function() {
                    var scrollTopStep = scrollParams.scrollTopStep;
                    var scrollLeftStep = scrollParams.scrollLeftStep;
                    if (Math.abs(scrollTopStep) > Math.abs(scrollParams.scrollTop)) scrollTopStep = scrollParams.scrollTop;
                    if (Math.abs(scrollLeftStep) > Math.abs(scrollParams.scrollLeft)) scrollLeftStep = scrollParams.scrollLeft;
                    scrollParams.scrollTop -= scrollTopStep;
                    scrollParams.scrollLeft -= scrollLeftStep;
                    playlist.scrollTop += scrollTopStep;
                    playlist.scrollLeft += scrollLeftStep;
                    showScroll();
                    if (scrollParams.scrollTop == 0 && scrollParams.scrollLeft == 0 && scrollParams.interval) clearInterval(scrollParams.interval)
                };
                scrollParams.interval = setInterval(scrl, 15);
                scrl()
            };
            var onmousewheel = function(e) {
                var a1 = playlist.getElementsByTagName('a')[0];
                var a2 = playlist.getElementsByTagName('a')[1];
                var scrollVal = ((e.wheelDelta) ? (e.wheelDelta / 120) : (e.detail / (-3))) || 0;
                if (scrollVal && a1 && a2) {
                    var scrollTop = scrollVal * (a2.offsetTop - a1.offsetTop) * (-1);
                    var scrollLeft = scrollVal * (a2.offsetLeft - a1.offsetLeft) * (-1);
                    scrollPlaylist(scrollTop, scrollLeft)
                }
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                if (e.returnValue) e.returnValue = false;
                return false
            };
            var mw = function(e) {
                var target = e.target || e.srcElement;
                while (true) {
                    if (target == document) break;
                    if (target == playlist) return onmousewheel(e);
                    target = target.parentNode
                }
            };
            addHandler(document, 'mousewheel', mw);
            addHandler(document, 'DOMMouseScroll', mw);
            var touchXY = {
                x: 0,
                y: 0
            };
            var scrollInertia = {
                scroll: false,
                scrollX: 0,
                scrollY: 0,
                scrollXH: [],
                scrollYH: [],
                interval: null,
                stopTimeout: null
            };
            var touchStart = function(e) {
                if (scrollInertia.interval) clearInterval(scrollInertia.interval);
                touchXY.x = e.touches[0].pageX;
                touchXY.y = e.touches[0].pageY
            };
            var touchMove = function(e) {
                var x = e.touches[0].pageX;
                var y = e.touches[0].pageY;
                var deltaX = x - touchXY.x;
                var deltaY = y - touchXY.y;
                playlist.scrollTop -= deltaY;
                playlist.scrollLeft -= deltaX;
                showScroll();
                touchXY.x = x;
                touchXY.y = y;
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                if (e.returnValue) e.returnValue = false;
                if (deltaX != 0) {
                    scrollInertia.scrollXH.push(deltaX);
                    scrollInertia.scrollXH = scrollInertia.scrollXH.slice(-3);
                    scrollInertia.scrollX = Math[deltaX > 0 ? 'max' : 'min'].apply(null, scrollInertia.scrollXH)
                } else {
                    scrollInertia.scrollX = 0
                }
                if (deltaY != 0) {
                    scrollInertia.scrollYH.push(deltaY);
                    scrollInertia.scrollYH = scrollInertia.scrollYH.slice(-3);
                    scrollInertia.scrollY = Math[deltaY > 0 ? 'max' : 'min'].apply(null, scrollInertia.scrollYH)
                } else {
                    scrollInertia.scrollY = 0
                }
                if (scrollInertia.stopTimeout) clearTimeout(scrollInertia.stopTimeout);
                scrollInertia.scroll = true;
                scrollInertia.stopTimeout = setTimeout(function() {
                    scrollInertia.scroll = false
                }, 60);
                return false
            };
            inertialScroll = function() {
                scrollInertia.scroll = false;
                if (scrollInertia.interval) clearInterval(scrollInertia.interval);
                scrollInertia.interval = setInterval(function() {
                    playlist.scrollTop -= scrollInertia.scrollY;
                    playlist.scrollLeft -= scrollInertia.scrollX;
                    scrollInertia.scrollY *= 0.93;
                    scrollInertia.scrollX *= 0.93;
                    scrollInertia.scrollY = Math[scrollInertia.scrollY < 0 ? 'ceil' : 'floor'](scrollInertia.scrollY);
                    scrollInertia.scrollX = Math[scrollInertia.scrollX < 0 ? 'ceil' : 'floor'](scrollInertia.scrollX);
                    showScroll();
                    if (scrollInertia.scrollY == 0 && scrollInertia.scrollX == 0) clearInterval(scrollInertia.interval)
                }, 10)
            };
            var touchEnd = function(e) {
                if (scrollInertia.scroll) inertialScroll()
            };
            addHandler(playlist, 'touchstart', touchStart);
            addHandler(playlist, 'touchmove', touchMove);
            addHandler(playlist, 'touchend', touchEnd);
            addHandler(playlist, 'touchleave', touchEnd);
            addHandler(playlist, 'touchcancel', touchEnd);
            var mouseXY = {
                scrolling: false,
                x: 0,
                y: 0
            };
            var scrollMoveStart = function(e) {
                mouseXY.scrolling = true;
                scroll.bar.className = scroll.bar.className + ' scrolling';
                mouseXY.x = e.pageX;
                mouseXY.y = e.pageY
            };
            var scrollMove = function(e) {
                if (!mouseXY.scrolling) return;
                var x = e.pageX;
                var y = e.pageY;
                var deltaX = x - mouseXY.x;
                var deltaY = y - mouseXY.y;
                var scrolled = false;
                if (scroll.orientation == 'vertical') {
                    if ((deltaY < 0 && playlist.scrollTop > 0) || (deltaY > 0 && playlist.scrollTop < playlist.scrollHeight - playlist.clientHeight)) {
                        var delta = deltaY / (scroll.bar.clientHeight - scroll.scroll.clientHeight);
                        delta = Math.round(delta * (playlist.scrollHeight - playlist.clientHeight));
                        playlist.scrollTop += delta;
                        scrolled = true
                    }
                } else {
                    if ((deltaX < 0 && playlist.scrollLeft > 0) || (deltaX > 0 && playlist.scrollLeft < playlist.scrollWidth - playlist.clientWidth)) {
                        var delta = deltaX / (scroll.bar.clientWidth - scroll.scroll.clientWidth);
                        delta = Math.round(delta * (playlist.scrollWidth - playlist.clientWidth));
                        playlist.scrollLeft += delta;
                        scrolled = true
                    }
                }
                if (scrolled) {
                    calcScrollSize();
                    mouseXY.x = x;
                    mouseXY.y = y
                }
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                if (e.returnValue) e.returnValue = false;
                return false
            };
            var scrollMoveEnd = function(e) {
                mouseXY.scrolling = false;
                scroll.bar.className = scroll.bar.className.replace(/\sscrolling(\s|$)/ig, '$1')
            };
            if (scroll.scroll) {
                addHandler(scroll.scroll, 'mousedown', scrollMoveStart);
                addHandler(document, 'mouseup', scrollMoveEnd);
                addHandler(document, 'mousemove', scrollMove);
                addHandler(window, 'resize', function() {
                    calcScrollSize()
                })
            }
        },
        preventSelection: function(element) {
            var removeSelection = function() {
                if (window.getSelection) window.getSelection().removeAllRanges();
                else if (document.selection && document.selection.clear) document.selection.clear()
            };
            addHandler(element, 'mousemove', removeSelection);
            addHandler(element, 'mousedown', removeSelection);
            addHandler(element, 'mouseup', removeSelection);
            addHandler(element, 'keydown', removeSelection);
            addHandler(element, 'keyup', removeSelection);
            addHandler(element, 'touchstart', removeSelection);
            addHandler(element, 'touchend', removeSelection)
        },
        _agent: null,
        agent: function() {
            if (this._agent !== null) return this._agent;
            var agent_str = window.navigator.userAgent;
            this._agent = {
                device: 'other',
                os: {
                    name: 'other',
                    version: {
                        major: 0,
                        minor: 0,
                        float: 0.0,
                        full: ''
                    }
                }
            };
            var apple_ios, apple_device;
            if (apple_device = agent_str.match(/(^|[^\w])(iPhone|iPad|iPop)($|[^\w])/i)) {
                this._agent.device = apple_device[2].toLowerCase();
                if (apple_ios = agent_str.match(/(^|[^\w])OS\s+((\d+)(_(\d+))?(_\d+)*)($|[^\w])/i)) {
                    this._agent.os.name = 'ios';
                    this._agent.os.version.major = parseInt(apple_ios[3]);
                    this._agent.os.version.minor = parseInt(apple_ios[5]);
                    this._agent.os.version.float = parseFloat(this._agent.os.version.major + '.' + this._agent.os.version.minor);
                    this._agent.os.version.full = apple_ios[2].replace(/_/g, '.')
                }
            }
            return this._agent
        }
    };

    /*fadeOut(el);
    fadeIn(el);
    fadeIn(el, "inline-block");*/

    function fadeOut(el){
      el.style.opacity = 1;
      (function fade() {
        if ((el.style.opacity -= .1) < 0) {
          el.style.display = "none";
        } else {
          requestAnimationFrame(fade);
        }
      })();
    }

    function fadeIn(el, display){
      el.style.opacity = 0;
      el.style.display = display || "block";
      (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
          el.style.opacity = val;
          requestAnimationFrame(fade);
        }
      })();
    }

    function addHandler(object, event, handler, useCapture) {
          if (object.addEventListener) {
                object.addEventListener(event, handler, useCapture ? useCapture : false);
          } else if (object.attachEvent) {
                object.attachEvent('on' + event, handler);
          } 
    }

    function bindEvent(element, eventName, eventHandler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, eventHandler);
        }
    }

    bindEvent(window, 'message', function (e) {
        if(e.data == 'close-list'){
            document.getElementById("player").setAttribute("style", "width:100%");
            document.getElementById("playlist").setAttribute("style", "z-index:9999; width: 0px; top: 0; right: 0; height: 100%;");
        }
        if(e.data == 'open-list'){
            document.getElementById("player").setAttribute("style", "width:calc(100% - 230px)");
            document.getElementById("playlist").setAttribute("style", "z-index:1; width: 230px; top: 0; right: 0; height: 100%;");
        }
        if(e.data == 'toggle-list'){
            var a = document.getElementById("playlist").offsetWidth;
            /*if(a == 0){
                document.getElementById("player").setAttribute("style", "width:calc(100% - 230px)");
                document.getElementById("playlist").setAttribute("style", "z-index:1; width: 230px; top: 0; right: 0; height: 100%;");
            } else {
                document.getElementById("player").setAttribute("style", "width:100%");
                document.getElementById("playlist").setAttribute("style", "z-index:9999; width: 0px; top: 0; right: 0; height: 100%;");
            }*/
            if(a == 0){
                AnimateOpen();
                document.getElementById("player").setAttribute("style", "width:100%");
                document.getElementById("playlist").setAttribute("style", "z-index:9999; width:0px; top: 0; right: 0; height: 100%;");
            } else {
                AnimateClose();
                document.getElementById("player").setAttribute("style", "width:100%");
                document.getElementById("playlist").setAttribute("style", "z-index:9999; width: 230px; top: 0; right: 0; height: 100%;");
            }
        }
    });

    function AnimateOpen() {
        if(document.getElementById("player").offsetWidth < 440){
            var elem = document.getElementById("playlist");
            var pos = 0;
            var id = setInterval(frame, 1);
            function frame() {
                if (pos == 230) {
                    clearInterval(id);
                } else {
                    pos += 10;
                    elem.style.width = pos + 'px';
                }
            }
        }
    } 

    function AnimateClose() {
        if(document.getElementById("player").offsetWidth < 440){
            var elem = document.getElementById("playlist");
            var pos = 230;
            var id = setInterval(frame, 1/100);
            function frame() {
                if (pos == 0) {
                    clearInterval(id);
                } else {
                    pos -= 10;
                    elem.style.width = pos + 'px';
                }
            }
        }
    }
