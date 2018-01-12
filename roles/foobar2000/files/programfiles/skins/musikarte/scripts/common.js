// @name "musikarte"
// @version "0.4.1"
// @author "Eric Chu (eric@mozest.com)"

var skin_path                    = fb.FoobarPath + "skins\\musikarte\\";

var script_path                  = skin_path + "scripts\\";

var lastfm_path                  = skin_path + "last.fm\\";

var lastfm_sqlite_exe            = lastfm_path + "sqlite3.exe";
var lastfm_import_cmd            = lastfm_path + "import.cmd";

var lastfm_profile_path          = lastfm_path + "profile\\";
var lastfm_username_file         = lastfm_profile_path + "username";
var lastfm_sk_file               = lastfm_profile_path + "sk";

var lastfm_data_path             = lastfm_path + "data\\";
var lastfm_database_file         = fb.ProfilePath + "customdb_sqlite.db";
var lastfm_scrobble_cache_file   = lastfm_data_path + "scrobble.cache";
var lastfm_sql_file              = lastfm_data_path + "datebase.sql";

var image_path                   = skin_path + "images\\";

var icon_play                    = image_path + "icon_play.png";
var icon_play_hover              = image_path + "icon_play_h.png";
var icon_play_pressed            = image_path + "icon_play_p.png";
var icon_pause                   = image_path + "icon_pause.png";
var icon_pause_hover             = image_path + "icon_pause_h.png";
var icon_pause_pressed           = image_path + "icon_pause_p.png";
var icon_play_w                  = icon_play_h = icon_pause_w = icon_pause_h = 26;

var icon_prev                    = image_path + "icon_prev.png";
var icon_prev_hover              = image_path + "icon_prev_h.png";
var icon_prev_pressed            = image_path + "icon_prev_p.png";
var icon_next                    = image_path + "icon_next.png";
var icon_next_hover              = image_path + "icon_next_h.png";
var icon_next_pressed            = image_path + "icon_next_p.png";
var icon_prev_w                  = icon_next_w = 31;
var icon_prev_h                  = icon_next_h = 17;

var icon_repeat                  = image_path + "icon_repeat.png";
var icon_repeat_hover            = image_path + "icon_repeat_h.png";
var icon_repeat_pressed          = image_path + "icon_repeat_p.png";
var icon_repeat_on               = image_path + "icon_repeat_on.png";
var icon_repeat_on_hover         = image_path + "icon_repeat_on_h.png";
var icon_repeat_on_pressed       = image_path + "icon_repeat_on_p.png";
var icon_repeat_track_on         = image_path + "icon_repeat_track_on.png";
var icon_repeat_track_on_hover   = image_path + "icon_repeat_track_on_h.png";
var icon_repeat_track_on_pressed = image_path + "icon_repeat_track_on_p.png";
var icon_shuffle                 = image_path + "icon_shuffle.png";
var icon_shuffle_hover           = image_path + "icon_shuffle_h.png";
var icon_shuffle_pressed         = image_path + "icon_shuffle_p.png";
var icon_shuffle_on              = image_path + "icon_shuffle_on.png";
var icon_shuffle_on_hover        = image_path + "icon_shuffle_on_h.png";
var icon_shuffle_on_pressed      = image_path + "icon_shuffle_on_p.png";
var icon_repeat_w                = icon_shuffle_w = 12;
var icon_repeat_h                = icon_shuffle_h = 11;

var icon_rating                  = image_path + "icon_rating.png";
var icon_rating_hover            = image_path + "icon_rating_h.png";
var icon_rating_pressed          = image_path + "icon_rating_p.png";
var icon_rating_on               = image_path + "icon_rating_on.png";
var icon_rating_on_hover         = image_path + "icon_rating_on_h.png";
var icon_rating_on_pressed       = image_path + "icon_rating_on_p.png";
var icon_rating_w                = 28;
var icon_rating_h                = 25;

var icon_lastfm                  = image_path + "icon_lastfm.png";
var icon_lastfm_hover            = image_path + "icon_lastfm_h.png";
var icon_lastfm_pressed          = image_path + "icon_lastfm_p.png";
var icon_lastfm_on               = image_path + "icon_lastfm_on.png";
var icon_lastfm_on_hover         = image_path + "icon_lastfm_on_h.png";
var icon_lastfm_on_pressed       = image_path + "icon_lastfm_on_p.png";
var icon_lastfm_na               = image_path + "icon_lastfm_n.png";
var icon_lastfm_loading          = image_path + "icon_lastfm_l.png";
var icon_lastfm_w                = 44;
var icon_lastfm_h                = 25;

var icon_volume                  = image_path + "icon_volume.png";
var icon_volume_hover            = image_path + "icon_volume_h.png";
var icon_volume_w                = 12;
var icon_volume_h                = 11;

//////////////////////////////////////////////////////////////////////

var DT_TOP          = 0x00000000,
	DT_LEFT         = 0x00000000,
	DT_CENTER       = 0x00000001,
	DT_RIGHT        = 0x00000002,
	DT_VCENTER      = 0x00000004,
	DT_BOTTOM       = 0x00000008,
	DT_WORDBREAK    = 0x00000010,
	DT_CALCRECT     = 0x00000400,
	DT_NOPREFIX     = 0x00000800,
	DT_END_ELLIPSIS = 0x00008000,
	
	MF_SEPARATOR    = 0x00000800,
	MF_ENABLED      = 0x00000000,
	MF_GRAYED       = 0x00000001,
	MF_DISABLED     = 0x00000002,
	MF_UNCHECKED    = 0x00000000,
	MF_CHECKED      = 0x00000008,
	MF_STRING       = 0x00000000,
	MF_POPUP        = 0x00000010,
	
	IDC_ARROW       = 32512,
	IDC_IBEAM       = 32513,
	IDC_WAIT        = 32514,
	IDC_CROSS       = 32515,
	IDC_UPARROW     = 32516,
	IDC_SIZE        = 32640,
	IDC_ICON        = 32641,
	IDC_SIZENWSE    = 32642,
	IDC_SIZENESW    = 32643,
	IDC_SIZEWE      = 32644,
	IDC_SIZENS      = 32645,
	IDC_SIZEALL     = 32646,
	IDC_NO          = 32648,
	IDC_APPSTARTING = 32650,
	IDC_HAND        = 32649,
	
	MK_SHIFT        = 0x0004,

	MF_STRING = 0x00000000,
	MF_POPUP = 0x00000010,

	ColorTypeCUI = {
		text                          : 0,
		selection_text                : 1,
		inactive_selection_text       : 2,
		background                    : 3,
		selection_background          : 4,
		inactive_selection_background : 5,
		active_item_frame             : 6
	},
	
	FontTypeCUI = {
		items  : 0,
		labels : 1
	},
	
	ColorTypeDUI = {
		text       : 0,
		background : 1,
		highlight  : 2,
		selection  : 3
	},
	
	FontTypeDUI = {
		defaults  : 0,
		tabs      : 1,
		lists     : 2,
		playlists : 3,
		statusbar : 4,
		console   : 5
	},
	
	StringAlignment = {
		Near   : 0,
		Center : 1,
		Far    : 2
	},
	
	StringTrimming = {
		None              : 0,
		Character         : 1,
		Word              : 2,
		EllipsisCharacter : 3,
		EllipsisWord      : 4,
		EllipsisPath      : 5
	};

var pw         = window.Width;
var ph         = window.Height;
var hWnd       = utils.GetHWND("{E7076D1C-A7BF-4f39-B771-BCBE88F2A2A8}");
var mouse_over = mouse_down = false;
var mouse_down_x = mouse_down_y = 0;

function sprintf () {
    // http://kevin.vanzonneveld.net
    // +   original by: Ash Searle (http://hexmen.com/blog/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Paulo Freitas
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: sprintf("%01.2f", 123.1);
    // *     returns 1: 123.10
    // *     example 2: sprintf("[%10s]", 'monkey');
    // *     returns 2: '[    monkey]'
    // *     example 3: sprintf("[%'#10s]", 'monkey');
    // *     returns 3: '[####monkey]'
    var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
    var a = arguments,
        i = 0,
        format = a[i++];

    // pad()
    var pad = function (str, len, chr, leftJustify) {
        if (!chr) {
            chr = ' ';
        }
        var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
    };

    // justify()
    var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
        var diff = minWidth - value.length;
        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, customPadChar, leftJustify);
            } else {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
        }
        return value;
    };

    // formatBaseX()
    var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0;
        prefix = prefix && number && {
            '2': '0b',
            '8': '0',
            '16': '0x'
        }[base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };

    // formatString()
    var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
        if (precision != null) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };

    // doFormat()
    var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
        var number;
        var prefix;
        var method;
        var textTransform;
        var value;

        if (substring == '%%') {
            return '%';
        }

        // parse flags
        var leftJustify = false,
            positivePrefix = '',
            zeroPad = false,
            prefixBaseX = false,
            customPadChar = ' ';
        var flagsl = flags.length;
        for (var j = 0; flags && j < flagsl; j++) {
            switch (flags.charAt(j)) {
            case ' ':
                positivePrefix = ' ';
                break;
            case '+':
                positivePrefix = '+';
                break;
            case '-':
                leftJustify = true;
                break;
            case "'":
                customPadChar = flags.charAt(j + 1);
                break;
            case '0':
                zeroPad = true;
                break;
            case '#':
                prefixBaseX = true;
                break;
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth) {
            minWidth = 0;
        } else if (minWidth == '*') {
            minWidth = +a[i++];
        } else if (minWidth.charAt(0) == '*') {
            minWidth = +a[minWidth.slice(1, -1)];
        } else {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
        } else if (precision == '*') {
            precision = +a[i++];
        } else if (precision.charAt(0) == '*') {
            precision = +a[precision.slice(1, -1)];
        } else {
            precision = +precision;
        }

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch (type) {
        case 's':
            return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
        case 'c':
            return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
        case 'b':
            return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'o':
            return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'x':
            return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'X':
            return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
        case 'u':
            return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'i':
        case 'd':
            number = (+value) | 0;
            prefix = number < 0 ? '-' : positivePrefix;
            value = prefix + pad(String(Math.abs(number)), precision, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        case 'e':
        case 'E':
        case 'f':
        case 'F':
        case 'g':
        case 'G':
            number = +value;
            prefix = number < 0 ? '-' : positivePrefix;
            method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
            textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
            value = prefix + Math.abs(number)[method](precision);
            return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
        default:
            return substring;
        }
    };

    return format.replace(regex, doFormat);
}

function __(message) {
	if (typeof mo == "undefined" || typeof mo[lang] == "undefined" || typeof mo[lang][message] == "undefined") {
		return message;
	} else {
		return mo[lang][message];
	}
}

function RGBA(r, g, b, a) {
	return ((a << 24) | (r << 16) | (g << 8) | (b));
}

function RGB(r, g, b) {
	return (0xff000000 | (r << 16) | (g << 8) | (b));
}

function StringFormat() {
	var h_align = 0, v_align = 0, trimming = 0, flags = 0;
	switch (arguments.length)
	{
	case 4:
		flags    = arguments[3];
	case 3:
		trimming = arguments[2];
	case 2:
		v_align  = arguments[1];
	case 1:
		h_align  = arguments[0];
		break;
	default:
		return 0;
	}
	return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
}

function TimeFmt(t){
	var zpad = function(n){
		var str = n.toString();
		return (str.length<2) ? "0"+str : str;
	}
	var h = Math.floor(t/3600); t-=h*3600;
	var m = Math.floor(t/60); t-=m*60;
	var s = Math.floor(t);
	if(h>0) return h.toString()+":"+zpad(m)+":"+zpad(s);
	return m.toString()+":"+zpad(s);
}

function on_mouse_rbtn_up(x, y, vkey){
	if (vkey == MK_SHIFT) {
		return;
	} else {
		return true;
	}
}
