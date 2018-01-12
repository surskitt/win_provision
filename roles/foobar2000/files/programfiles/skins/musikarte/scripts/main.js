//////////////////////////////////////////////////////////////////////
var script_name = "foobar2000 Scrobbler",
	user_agent = "foo_scrobbler";
//////////////////////////////////////////////////////////////////////
var lastfm_api_key     = "0569de53d40d0345d45fda779c06c6e4",
	lastfm_api_secret  = "f18ca48d57fe6f0dfff313713f818f3e",
	lastfm_retry_delay = 10;
//////////////////////////////////////////////////////////////////////
var WshShell = new ActiveXObject("WScript.Shell");
var fso      = new ActiveXObject("Scripting.FileSystemObject");
var doc      = new ActiveXObject("htmlfile");
var vb       = new ActiveXObject('ScriptControl');
vb.Language  = 'VBScript';

if (!fso.FolderExists(lastfm_profile_path)) {
	fso.CreateFolder(lastfm_profile_path);
}
if (!fso.FolderExists(lastfm_data_path)) {
	fso.CreateFolder(lastfm_data_path);
}

var g_timer      = window.CreateTimerInterval(1000),
	time_elapsed = target_time = 0;
var auto_love    = window.GetProperty("auto_love", false),
	auto_love_tf = window.GetProperty("auto_love_tf", ""),
	show_console = window.GetProperty("show_console", true);
var g_textrender          = gdi.CreateStyleTextRender();
var text_artist           = text_album = text_year = text_title = "";
var info_x                = 10;
var info_y                = 31;
var rate                  = 0;
var in_rating             = in_prev_next = in_play_pause = in_volume = in_volumebar = volume_hover = in_title = false;
var volume_drag = 0;
var mouse_down_c = 0;

var start             = 1;

var fi_metadb = null,
	gs_metadb = null, gs_tracks = {},
	np_metadb = null, np_track = {}, np_track_prop = {};

var panel_padding     = 20;
var icon_hmargin = 20;


var compact_mode_ww     = 572;
	compact_mode_wh     = 257,
	switch_mode_ww      = 800,
	switch_mode_wh      = 600;

var wbs = 6;

var screen_w = utils.GetSystemMetrics(16) + wbs * 2,
	screen_h = utils.GetSystemMetrics(17) + utils.GetSystemMetrics(4) + wbs * 2;

var ww                  = function() {return utils.GetWindowInfoW(hWnd, 3) - utils.GetWindowInfoW(hWnd, 2)};
var wh                  = function() {return utils.GetWindowInfoW(hWnd, 4) - utils.GetWindowInfoW(hWnd, 1)};
var wx                  = function() {return utils.GetWindowInfoW(hWnd, 2)};
var wy                  = function() {return utils.GetWindowInfoW(hWnd, 1)};

var c_ww                = window.GetProperty("c_ww", ww());
var c_wh                = window.GetProperty("c_wh", wy());
var g_ww                = window.GetProperty("g_ww", compact_mode_ww);
var g_wh                = window.GetProperty("g_wh", compact_mode_wh);
var g_wx                = window.GetProperty("g_wx", wx());
var g_wy                = window.GetProperty("g_wy", wy());
window.NotifyOthers("g_ww", g_ww);
window.NotifyOthers("g_wh", g_wh);

var font_size_artist  = 24,
	font_size_album   = 14,
	font_size_year    = 12,
	font_size_title   = 14,
	font_size_time    = 10;

var font_artist           = gdi.font("Segoe UI", font_size_artist, 0),
	font_album            = gdi.font("Segoe UI", font_size_album, 0),
	font_year             = gdi.font("Segoe UI", font_size_year, 0),
	font_title            = gdi.font("Segoe UI", font_size_title, 0),
	font_time             = gdi.font("Segoe UI", font_size_time, 0);


var in_rating             = in_lastfm = in_prev = in_next = in_play_pause = in_volume = in_volumebar = false;

var text_artist_x,
	text_artist_y,
	text_album_x,
	text_album_y,
	text_year_x,
	text_year_y,
	text_title_x,
	text_title_y,
	text_time_x,
	text_time_y;

var icon_prev_x,
	icon_prev_y,
	icon_play_pause_x,
	icon_play_pause_y,
	icon_next_x,
	icon_next_y,
	icon_rating_x,
	icon_rating_y,
	icon_lastfm_x,
	icon_volume_x,
	icon_volume_y,
	icon_repeat_x,
	icon_repeat_y,
	icon_shuffle_x,
	icon_shuffle_w,
	icon_shuffle_y;

var volumebar_w = 48,
	volumebar_h = 3,
	volumebar_w_d = 0,
	volumebar_x,
	volumebar_y;

function get_el_position() {
	text_artist_x     = text_album_x = text_year_x = text_title_x = 0;
	text_artist_y     = 30;
	text_album_y      = 62;
	text_year_y       = 78;
	text_title_y      = 105;

	icon_play_pause_x = pw - 12 - icon_play_w;
	icon_play_pause_y = 0;

	icon_next_x       = pw - panel_padding - icon_next_w;
	icon_next_y       = 194 ;
	icon_prev_x       = icon_next_x - icon_hmargin - icon_prev_w;
	icon_prev_y       = 194 ;
	icon_lastfm_x     = icon_prev_x - icon_hmargin - icon_lastfm_w;
	icon_lastfm_y     = 190;
	icon_rating_x     = icon_lastfm_x - icon_hmargin - icon_rating_w;
	icon_rating_y     = 190;

	icon_shuffle_x = pw - panel_padding - icon_shuffle_w;
	icon_shuffle_y = icon_repeat_y  = 133;
	icon_repeat_x  = icon_shuffle_x - 4 - icon_repeat_w;

	volumebar_x       = pw - panel_padding - volumebar_w_d - 35;
	volumebar_y       = icon_volume_y = 133;
	icon_volume_x     = volumebar_x - icon_volume_w;

	//text_time_x      = icon_volume_x - 106;
	text_time_x      = 0;
	text_time_y      = 132;
}

function read(fn) {
	try {
		var f = fso.OpenTextFile(fn, 1, false, -1);
		var s = f.Readline();
		f.Close();
		return s;
	} catch(e) {
		return '';
	}
}

function save_text_file(t, f) {
	try {
		var ts = fso.OpenTextFile(f, 2, true, -1);
		ts.WriteLine(t);
		ts.close();
	} catch(e) {
		console_output(sprintf(__("保存文本文件失败：\n%s"), e.message + " | " + e.number + " | " + e.name));
	}
}

function save_binary_file(filename, content) {
	try {   
		var ostream = new ActiveXObject("adodb.stream");
		ostream.Type = 1 //binary 
		ostream.Open(); 
		ostream.Write(content);
		ostream.SaveToFile(filename,  2); 
	} catch(e) {
		console_output(sprintf(__("保存二进制文件失败：\n%s"), e.message + " | " + e.number + " | " + e.name));
	}
}

function tf(value) {
	value = value.replace(/'/g, "''");
	value = value.replace(/,/g, "','");
	value = value.replace(/\//g, "'/'");
	value = value.replace(/\(/g, "'('");
	value = value.replace(/\)/g, "')'");
	value = value.replace(/\[/g, "'['");
	return (value.replace(/\]/g, "']'"));
}

//  \ / : * ? " < > |
function sf(value) {
	value = value.replace(/\\/g, "-");
	value = value.replace(/\//g, "-");
	value = value.replace(/:/g, "-");
	value = value.replace(/\*/g, "-");
	value = value.replace(/\?/g, "-");
	value = value.replace(/"/g, "-");
	value = value.replace(/</g, "-");
	value = value.replace(/>/g, "-");
	return (value.replace(/\|/g, "-"));
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

String.prototype.count = function(s1) { 
	return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
}

String.prototype.ucfirst = function() {
	return this.charAt(0).toUpperCase() + this.substr(1);
}

function console_output(message) {
	if (show_console) {
		fb.trace(script_name + "：" + message);
	}
}

function MsgBox(message, cancel_button, title) {
	cancel_button = typeof cancel_button != "undefined" && cancel_button == true ? 1 : 0;
	message = message.replace(/"/g, '" + Chr(34) + "');
	message = message.replace(/\n/g, '" + Chr(13) + "');
	title = typeof title != "undefined" ? title : script_name;
	return vb.eval("MsgBox" + "(\"" + message + "\", " + cancel_button + ", \"" + title + "\")");
}

function InputBox(message, title, value) {
	message = message.replace(/"/g, '" + Chr(34) + "');
	message = message.replace(/\n/g, '" + Chr(13) + "');
	title = title.replace(/"/g, '" + Chr(34) + "');
	value = value.replace(/"/g, '" + Chr(34) + "');
	var temp_value = vb.eval("InputBox" + "(\"" + message + "\", \"" + title + "\", \"" + value + "\")");
	return typeof temp_value == "undefined" ? "" : temp_value.trim();
}

function lastfm(params) {
	var api_key                   = params.api_key;
	var api_secret                = params.api_secret;
	var username                  = params.username;
	var sk                        = params.sk;
	var username_file             = params.username_file;
	var sk_file                   = params.sk_file;
	var retry_delay               = params.retry_delay;

	var scrobble_cache_file       = params.scrobble_cache_file;
	var scrobble_cache            = scrobble_cache = params.scrobble_cache.length > 0 ? JSON.parse(params.scrobble_cache) : [];

	this.import_cmd           = params.import_cmd;
	this.sql_file                  = params.sql_file;

	this.sqlite_exe               = params.sqlite_exe;
	this.database_file             = params.database_file;

	var send_now_playing_next     = 0;
	var send_scrobble_next        = 0;
	var send_scrobble_working     = false;

	this.auto_correct              = params.auto_correct;
	this.now_playing_loved_working = false;
	this.sync_track_working        = false;
	this.sync_loved_working        = false;
	this.sync_playcount_working    = false;

	var api_method_prop = {
			"auth.getMobileSession" : {
				"sig_required" : true,
				"http_method"  : "GET"
			},
			"track.updateNowPlaying" : {
				"sig_required" : true,
				"http_method"  : "POST"
			},
			"track.scrobble" : {
				"sig_required" : true,
				"http_method"  : "POST"
			},
		
			"track.love" : {
				"sig_required" : true,
				"http_method"  : "POST"
			},
			"track.unlove" : {
				"sig_required" : true,
				"http_method"  : "POST"
			},
			"track.getinfo" : {
				"sig_required" : false,
				"http_method"  : "GET"
			},
			"user.getlovedtracks" : {
				"sig_required" : false,
				"http_method"  : "GET"
			},
			"library.gettracks" : {
				"sig_required" : false,
				"http_method"  : "GET"
			},
			"album.getInfo" : {
				"sig_required" : false,
				"http_method"  : "GET"
			},
			"artist.getImages" : {
				"sig_required" : false,
				"http_method"  : "GET"
			}
		},
		
		build_api_sig = function(params) {
			var params_temp = {},
				params_keys = [],
				api_sig_str = '';
			for (var key in params) {
				params_temp[key] = decodeURIComponent(params[key]);
				params_keys.push(key);
			}
			params_keys.sort();
			for (var index in params_keys) {
				var key = params_keys[index];
				api_sig_str += key + params_temp[key];
			}
			api_sig_str += api_secret;
			return md5(api_sig_str);
		},

		connect = function(params, on_success, on_error) {
			var api_url = "http://ws.audioscrobbler.com/2.0/?format=json";
			params.api_key = api_key;
			if (params.method != "auth.getMobileSession") {
				if (api_method_prop[params.method]["sig_required"]) {
					params.sk = sk;
					api_url += "&api_sig=" + build_api_sig(params);
				} else {
					params.user = username;
					api_url += "&s=" + Math.random();
				}
			} else {
				api_url += "&api_sig=" + build_api_sig(params);
			}
			for (var key in params) {
				api_url += "&" + key + "=" + params[key];
			}
			console_output(api_url);
			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.open(api_method_prop[params.method]["http_method"], api_url, true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader('User-Agent', user_agent);
			xmlhttp.onreadystatechange = function() {
				on_ready_state_change(xmlhttp, on_success, on_error);
			}
			xmlhttp.send();
		},

		on_ready_state_change = function(xmlhttp, on_success, on_error) {
			on_success = on_success || function() {};
			on_error   = on_error   || function() {};
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					console_output(xmlhttp.responsetext);
					try {
						data = JSON.parse(xmlhttp.responsetext);
					} catch(e) {
						data = {
							"error"   : -100,
							"message" : __("未知错误。")
						};
					}
					console_output(JSON.stringify(data));
					(on_success)(data, xmlhttp);
				} else {
					message = __("与 Last.fm 服务器连接时发生错误。") + "\n" + (xmlhttp.responsetext || __("HTTP 错误: ") + xmlhttp.status);
					console_output(message);
					(on_error)(message, xmlhttp);
				}
			}
		},

		merge_track_to_params = function(params, track, track_order) {
			if (typeof track_order != "undefined") {
				track_order_str = "[" + track_order + "]";
			} else {
				track_order_str = "";
			}
			for (var key in track) {
				params[key + track_order_str] = encodeURIComponent(track[key]);
			}
			return params;
		}

	this.check_env = function(show_msgbox) {
		show_msgbox   = typeof show_msgbox == "undefined" ? false : (show_msgbox == true ? true : false);
		error_message = "";
		switch(true) {
			case !utils.CheckComponent("foo_customdb", true):
				error_message += __("未安装 \"foo_customdb\" 插件。") + "\n";
				break;
			case username.length == 0:
			case sk.length == 0:
				error_message += __("未设置 Last.fm 账户。") + "\n";
				break;
			case api_key.length != 32:
			case api_secret.length != 32:
				error_message += __("未设置 Last.fm API Key 或 secret。") + "\n";
				break;
		}
		if (error_message.length > 0) {
			if (show_msgbox) {
				MsgBox(error_message);
			}
			return false;
		}
		return true;
	}

	this.auth = function(username_temp, password_temp) {
		var params = {
				"method"    : "auth.getMobileSession",
				"username"  : username_temp,
				"authToken" : md5(username_temp + '' + md5(password_temp))
			},
			msgbox_title = __("设置 Last.fm 账户");
		connect(params, function(data) {
			if (typeof data.error != "undefined") {
				message = data.message;
			} else {
				username = username_temp;
				sk       = data.session.key;
				save_text_file(username, username_file);
				save_text_file(sk, sk_file);
				window.NotifyOthers("lastfm_update", 1);
				message = __("账户设置成功。");
			}
			MsgBox(message, msgbox_title);
		}, function(message) {
			MsgBox(message, msgbox_title);
		});
	}

	this.sync_track = function(track, track_prop, metadb) {
		if (lastfm.sync_loved_working || lastfm.sync_playcount_working) {
			return;
		} else {
			var params = {
					"method"      : "track.getinfo",
					"artist"      : encodeURIComponent(track.artist),
					"track"       : encodeURIComponent(track.track),
					"autocorrect" : lastfm.auto_correct ? 1 : 0
				}
			connect(params, function(data) {
				if (data.error > 0) {
					if (data.error == 6) {
						console_output(sprintf(__("同步曲目「%1$s」的「%2$s」的统计信息时发生错误，艺术家或曲目不存在。"), track.artist, track.track));
					} else {
						console_output(sprintf(__("同步曲目「%1$s」的「%2$s」的统计信息时发生错误。\n返回信息：%3$s"), track.artist, track.track, data.message));
					}
					return;
				}
				lastfm_playcount = data.track.userplaycount > 0 ? data.track.userplaycount : 0;
				lastfm_loved     = data.track.userloved == 1 ? 1 : 0;
				if (track_prop.playcount == lastfm_playcount && track_prop.loved == lastfm_loved) {
					console_output(sprintf(__("未同步曲目「%1$s」的「%2$s」的统计信息，没有发现数据变动。"), track.artist, track.track));
				} else if (!metadb) {
					console_output(__("未知错误。"));
				} else {
					if (track_prop.playcount != lastfm_playcount) {
						fb.RunContextCommandWithMetadb(__("重置播放次数"), metadb);
						var sql = '\"INSERT OR REPLACE INTO quicktag(url,subsong,fieldname,value) VALUES(\\"' + track_prop.crc32 + '\\",\\"-1\\",\\"LASTFM_PLAYCOUNT\\",\\"' + lastfm_playcount + '\\")\";';
						WshShell.Run(fso.GetFile(lastfm.sqlite_exe).ShortPath + " " + fso.GetFile(lastfm.database_file).ShortPath + " " + sql, 0, true);
						fb.RunContextCommandWithMetadb(__("刷新播放次数"), metadb);
						console_output(sprintf(__("同步曲目「%1$s」的「%2$s」的统计信息成功。（播放次数）"), track.artist, track.track));
					}
					if (track_prop.loved != lastfm_loved) {
						lastfm.sync_track_working = true;
						fb.RunContextCommandWithMetadb(lastfm_loved == 1 ? __("设为喜爱曲目") : __("从喜爱曲目中删除"), metadb);
						console_output(sprintf(__("同步曲目「%1$s」的「%2$s」的统计信息成功。（喜爱曲目）"), track.artist, track.track));
					}
				}
			}, function(message) {
				console_output(sprintf(__("同步曲目「%1$s」的「%2$s」的统计信息时发生错误。\n返回信息：%3$s"), track.artist, track.track, message));
			});
		}
	}

	this.send_now_playing = function(track, track_prop, metadb) {
		if (!lastfm.check_env()) {
			return;
		}
		var next_timestamp = get_timestamp() + retry_delay;
		var params = {
				"method" : "track.updateNowPlaying"
			}
		params = merge_track_to_params(params, track);
		console_output(sprintf(__("正在连接 Last.fm，准备发送正在收听的曲目「%1$s」的「%2$s」..."), track.artist, track.track));
		connect(params, function(data) {
			if (typeof data.error != "undefined") {
				send_now_playing_next = next_timestamp;
				console_output(sprintf(__("向 Last.fm 发送正在收听的曲目「%1$s」的「%2$s」时发生错误，%3$s 秒后将重试。\n返回信息：%4$s"), track.artist, track.track, retry_delay, data.message));
			} else {
				send_now_playing_next = 0;
				console_output(sprintf(__("向 Last.fm 发送正在收听的曲目「%1$s」的「%2$s」成功。"), track.artist, track.track));
				lastfm.sync_track(track, track_prop, metadb);
			}
		}, function(message) {
			send_now_playing_next = next_timestamp;
			console_output(sprintf(__("向 Last.fm 发送正在收听的曲目「%1$s」的「%2$s」时遇到网络问题，%3$s 秒后将重试。\n返回信息：%4$s"), track.artist, track.track, retry_delay, message));
		});
	}

	this.send_scrobble = function() {
		if (!lastfm.check_env()) {
			return;
		}
		var next_timestamp = get_timestamp() + retry_delay;
		var count = scrobble_cache.length;
		if (!count) {
			return;
		}
		if (send_scrobble_working) {
			send_scrobble_next = next_timestamp;
			console_output(sprintf(__("上一个向 Last.fm 发送 Scrobble 的操作尚未结束，%s 秒后将重试。"), retry_delay));
			return;
		}
		send_scrobble_working = true;
		console_output(__("正在向 Last.fm 发送 Scrobble..."));
		
		end = count >= 50 ? 49 : count;
		var params = {
				"method" : "track.scrobble"
			}
		for (i=0; i<=end; i++) {
			params = merge_track_to_params(params, scrobble_cache[i], i);
		}
		connect(params, function(data) {
			if (typeof data.error != "undefined") {
				send_scrobble_working = false;
				send_scrobble_next = next_timestamp;
				console_output(sprintf(__("向 Last.fm 发送 Scrobble 时发生错误，%1$s 秒后将重试。\n返回信息：%2$s"), retry_delay, data.message));
			} else {
				scrobble_cache.splice(0, count >= 50 ? 50 : count)
				lastfm.save_scrobble_queue_cache();
				send_scrobble_working = false;
				send_scrobble_next = 0;
				console_output(__("向 Last.fm 发送 Scrobble 成功。"));
				if (scrobble_cache.length > 0) {
					lastfm.send_scrobble();
				}
			}
		}, function(message){
			send_scrobble_working = false;
			send_scrobble_next = next_timestamp;
			console_output(sprintf(__("向 Last.fm 发送 Scrobble 时遇到网络问题，%1$s 秒后将重试。\n返回信息：%2$s"), retry_delay, message));
		});
	}
	
	this.update_scrobble_queue = function(obj) {
		obj.timestamp = get_timestamp();
		scrobble_cache.push(obj);
		lastfm.save_scrobble_queue_cache();
	}
	
	this.save_scrobble_queue_cache = function() {
		save_text_file(JSON.stringify(scrobble_cache), scrobble_cache_file);
	}

	this.send_love_track = function(artist, track, loved, metadb, now_playing_loved) {
		now_playing_loved = (typeof now_playing_loved == "undefined" || typeof now_playing_loved == false) ? false : true;
		if (now_playing_loved) {
			Buttons.lastfm = _Buttons_.lastfm_loading;
		}
		if (loved == 1) {
			api_method           = "track.love";
			command              = __("设为喜爱曲目"); 
			rollback_command     = __("从喜爱曲目中删除"); 
			console_text_ready   = sprintf(__("正在连接 Last.fm，准备将「%1$s」的「%2$s」设为喜爱曲目..."), artist, track);
			console_text_success = sprintf(__("从 Last.fm 上将「%1$s」的「%2$s」成功设为喜爱曲目。"), artist, track);
			console_text_error   = sprintf(__("从 Last.fm 上将「%1$s」的「%2$s」设为喜爱曲目失败。"), artist, track);
		} else {
			api_method           = "track.unlove";
			command              = __("从喜爱曲目中删除"); 
			rollback_command     = __("设为喜爱曲目"); 
			console_text_ready   = sprintf(__("正在连接 Last.fm，准备将「%1$s」的「%2$s」从喜爱曲目中删除..."), artist, track);
			console_text_success = sprintf(__("从 Last.fm 上将「%1$s」的「%2$s」成功从喜爱曲目中删除。"), artist, track);
			console_text_error   = sprintf(__("从 Last.fm 上将「%1$s」的「%2$s」从喜爱曲目中删除失败。"), artist, track);
		}
		console_output(console_text_ready);
		var params = {
				"method" : api_method,
				"artist" : encodeURIComponent(artist),
				"track"  : encodeURIComponent(track)
			},
			result = false;
		connect(params, function(data) {
			if (typeof data.error == "undefined" && typeof data.status != "undefined" && data.status == "ok") {
				result = true;
				console_output(console_text_success);
				if (now_playing_loved) {
					lastfm.now_playing_loved_working = true;
				}
				fb.RunContextCommandWithMetadb(command, metadb);
				if (now_playing_loved) {
					on_metadb_changed();
				}
			} else {
				fb.RunContextCommandWithMetadb(rollback_command, metadb);
				message = console_text_error + "\n" + __("返回信息：") + data.message;
				console_output(message);
				MsgBox(message);
			}
			set_lastfm_button();
			return result;
		}, function(message){
			fb.RunContextCommandWithMetadb(rollback_command, metadb);
			message = console_text_error + "\n" + __("返回信息：") + message;
			console_output(message);
			set_lastfm_button();
			MsgBox(message);
			return result;
		});
	}

	this.sync_library = function() {
		var msgbox_title = __("从 Last.fm 下载数据并导入");
		if (MsgBox(__("下载数据可能会花费一些时间，并且不会提示进度，请耐心等候。\n确定要继续吗？"), true, msgbox_title) != 1) {
			return;
		}
		var page                  = 1,
			pages                 = 0,
			r                     = 1,
			errors                = 0,
			loved_page_errors     = 0,
			playcount_page_errors = 0,
			sql                   = "BEGIN TRANSACTION;\n";
	
		function sync_library_loved() {
			if (!lastfm.sync_loved_working) {
				return console_output(__("导入已终止。"));
			}
			
			var params = {
					"method" : "user.getlovedtracks",
					"limit"  : "200",
					"page"   : page
				}
	
			connect(params, function(data, xmlhttp) {
				if (data.error > 0) {
					lastfm.sync_loved_working = false;
					MsgBox(sprintf(__("此问题与 Last.fm 服务器有关，请稍后重试。\n\n%s"), data.message), false, msgbox_title);
					return;
				}
				if (page == 1) {
					try {
						pages = data.lovedtracks["@attr"].totalPages;
					} catch(e) {
					}
				}
				if (pages > 0 && xmlhttp.responsetext.indexOf('{"lovedtracks":') == 0) {
					for (i = 0; i < data.lovedtracks.track.length; i++) {
						try {
							var arr = [];
							arr[0] = data.lovedtracks.track[i].artist.name;
							arr[1] = data.lovedtracks.track[i].name;
							arr[2] = 1;
							if (arr.length == 3) {
								console_output(r + ": " + arr[0] + " - " + arr[1]);
								url = fb.TitleFormat("$crc32($lower(" + tf(arr[0]) + "	" + tf(arr[1]) + "))").Eval(true);
								sql += 'INSERT OR REPLACE INTO quicktag(url,subsong,fieldname,value) VALUES("' + url + '","-1","LASTFM_LOVED","' + arr[2] + '");' + "\n";
								r++;
							}
						} catch(e) {
							errors++;
						}
					}
					console_output(sprintf(__("已完成 %1$s/%2$s 页（喜爱曲目）"), page, pages));
				} else {
					loved_page_errors++;
				}
				if (page < pages) {
					page++;
					sync_library_loved();
				} else {
					lastfm.sync_loved_working     = false;
					lastfm.sync_playcount_working = true;
					page  = 1;
					pages = 0;
					r     = 1;
					sync_library_playcount();
				}
			}, function(message) {
				lastfm.sync_loved_working = false;
				MsgBox(sprintf(__("网络错误，请稍后重试。\n\n%s"), message), false, msgbox_title);
			});
		}
	
		function sync_library_playcount() {
			if (!lastfm.sync_playcount_working) {
				return console_output(__("导入已终止。"));
			}
	
			var params = {
					"method" : "library.gettracks",
					"limit"  : "100",
					"page"   : page
				}
	
			connect(params, function(data, xmlhttp) {
				if (data.error > 0) {
					lastfm.sync_playcount_working = false;
					MsgBox(sprintf(__("此问题与 Last.fm 服务器有关，请稍后重试。\n\n%s"), data.message), false, msgbox_title);
					return;
				}
				if (page == 1) {
					try {
						pages = data.tracks["@attr"].totalPages;
					} catch(e) {
					}
				}
				if (pages > 0 && xmlhttp.responsetext.indexOf('{"tracks":') == 0) {
					for (i = 0; i < data.tracks.track.length; i++) {
						try {
							var arr = [];
							arr[0] = data.tracks.track[i].artist.name;
							arr[1] = data.tracks.track[i].name;
							arr[2] = data.tracks.track[i].playcount;
							if (arr[2] == 0) {
								page = pages;
								break;
							}
							if (arr.length == 3) {
								console_output(r + ": " + arr[0] + " - " + arr[1] + " " + arr[2]);
								url = fb.TitleFormat("$crc32($lower(" + tf(arr[0]) + "	" + tf(arr[1]) + "))").Eval(true);
								sql += 'INSERT OR REPLACE INTO quicktag(url,subsong,fieldname,value) VALUES("' + url + '","-1","LASTFM_PLAYCOUNT","' + arr[2] + '");' + "\n";
								r++;
							}
						} catch(e) {
							errors++;
						}
					}
					console_output(sprintf(__("已完成 %1$s/%2$s 页（播放次数）"), page, pages));
				} else {
					playcount_page_errors++;
				}
				if (page < pages) {
					page++;
					sync_library_playcount();
				} else {
					try {
						sql += "COMMIT;"
						ts = fso.OpenTextFile(lastfm.sql_file, 2, true, 0);
						ts.WriteLine(sql);
						ts.close();
						var msgbox_message = __("数据下载完成，要导入吗？\n此操作将重启 foobar2000。");
						if (loved_page_errors > 0 || playcount_page_errors > 0 || errors > 0) {
							msgbox_message += "\n";
							if (loved_page_errors > 0) {
								msgbox_message += "\n- " + sprintf(__("喜爱曲目下载失败页数：%s（每页包含 200 个曲目）"), loved_page_errors);
							}
							if (playcount_page_errors > 0) {
								msgbox_message += "\n- " + sprintf(__("播放次数下载失败页数：%s（每页包含 100 曲目）"), playcount_page_errors);
							}
							if (errors > 0) {
								msgbox_message += "\n- " + sprintf(__("单个曲目处理失败数：%s"), errors);
							}
							msgbox_message += "\n";
						}
						if (MsgBox(msgbox_message, true, msgbox_title) == 1) {
							try {
								WshShell.Run(fso.GetFile(lastfm.import_cmd).ShortPath + " " +
								fso.GetFile(lastfm.sqlite_exe).ShortPath + " " +
								fso.GetFile(lastfm.database_file).ShortPath + " " +
								fso.GetFile(lastfm.sql_file).ShortPath + " " +
								fso.GetFile(fb.FoobarPath + "foobar2000.exe").ShortPath + " " +
								"/exit");
							} catch(e) {
								MsgBox(__("未知错误。"), false, msgbox_title);
							}
						}
					} catch(e) {
						MsgBox(__("未知错误。"), false, msgbox_title);
					}
					lastfm.sync_playcount_working = false;
					console_output(sprintf(__("下载喜爱曲目错误页数：%s（每页包含 200 个曲目）"), loved_page_errors));
					console_output(sprintf(__("下载播放次数错误页数：%s（每页包含 100 曲目）"), playcount_page_errors));
					console_output(sprintf(__("单个曲目错误数：%s"), errors));
				}
			}, function(message) {
				lastfm.sync_playcount_working = false;
				MsgBox(sprintf(__("网络错误，请稍后重试。\n\n%s"), message), false, msgbox_title);
			});
		}
	
		lastfm.sync_loved_working = true;
		sync_library_loved();
	}

	this.import_sql = function() {
		var msgbox_title = __("导入已下载的数据");
		if (MsgBox(__("导入操作将重启 foobar2000，确定要继续吗？"), true, msgbox_title) != 1) {
			return;
		}
		try {
			WshShell.Run(fso.GetFile(lastfm.import_cmd).ShortPath + " " +
			fso.GetFile(lastfm.sqlite_exe).ShortPath + " " +
			fso.GetFile(lastfm.database_file).ShortPath + " " +
			fso.GetFile(lastfm.sql_file).ShortPath + " " +
			fso.GetFile(fb.FoobarPath + "foobar2000.exe").ShortPath + " " +
			"/exit");
		} catch(e) {
			MsgBox(__("未知错误。"), false, msgbox_title);
		}
	}

	this.get_artist_pic = function(artist, metadb) {
		var limit = 10;
		var params = {
				"method"      : "artist.getImages",
				"artist"      : encodeURIComponent(artist),
				"limit"       : limit,
				"autocorrect" : lastfm.auto_correct ? 1 : 0
			},
			msgbox_title = "下载艺术家图片";

		connect(params, function(data) {
			if (typeof data.error != "undefined") {
				MsgBox(sprintf(__("下载失败。\n返回信息：%s"), data.message), false, msgbox_title);
			} else {
				var images = data["images"]["image"],
					urls = [];
				for (var i = 0; i < images.length; i++) {
					var sizes = images[i]["sizes"]["size"];
					for (var j = 0; j < sizes.length; j++) {
						if (sizes[j]["name"] == "original" && sizes[j]["#text"].length > 0) {
							urls.push(sizes[j]["#text"]);
						}
					}
				}
				if (urls.length > 0) {
					var filename = metadb.RawPath.replace("file://", "").replace(metadb.RawPath.slice(metadb.RawPath.lastIndexOf("\\")), "") + "\\" + sf(artist);
					if (urls.length == 1) {
						lastfm.download_pic(urls[0], filename + urls[0].slice(urls[0].lastIndexOf(".")), msgbox_title);
					} else {
						var num = 1;
						for (var i in urls) {
							lastfm.download_pic(urls[i], filename + " " + num + urls[i].slice(urls[i].lastIndexOf(".")), msgbox_title);
							num++;
						}
					}
				} else {
					MsgBox(__("没有图片可供下载。"), false, msgbox_title);
				}
			}
		}, function(message){
			MsgBox(sprintf(__("下载失败。\n返回信息：%s"), message), false, msgbox_title);
		});
		return;

		try {
			if (artist.length > 0) {
				var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				xmlhttp.open("GET", "http://ws.audioscrobbler.com/2.0?method=artist.getImages&artist=" + encodeURIComponent(artist) + "&limit=" + limit + "&s=" + Math.random() + "&api_key=" + LastFMAPI, true);
				xmlhttp.onreadystatechange = function() {
					try {
						if (xmlhttp.readystate == 4) {
							if (xmlhttp.status == 200) {
								var xmldom = new ActiveXObject("Microsoft.XMLDOM");
								xmldom.async = "false";
								xmldom.loadXML(xmlhttp.responsetext);
								var urls = [];
								try {
									var images = xmldom.getElementsByTagName("image");
									for (var i = 0; i < images.length; i++) {
										var sizes = images[i].getElementsByTagName("size");
										for (var j = 0; j < sizes.length; j++) {
											if (sizes[j].attributes.getNamedItem("name").value == "original") 
												if (sizes[j].childNodes.length > 0) 
													urls.push(sizes[j].childNodes[0].nodeValue);
												else 
													urls.push("");
										}
									}
								} 
								catch (e) {
									fb.trace("ERROR GetArtistPics 1: " + e.message + " | " + e.number + " | " + e.name);
								}
								for (var i in urls) {
									LastFM.downloadpic(urls[i], artist)
								}
							}
							else {
								var xmldom = new ActiveXObject("Microsoft.XMLDOM");
								xmldom.async = "false";
								xmldom.loadXML(xmlhttp.responsetext);
								throw new Error(0, "Last.fm: " + xmldom.getElementsByTagName("error")[0].childNodes[0].nodeValue)
							}
						}
					} catch(e) {
						fb.trace("ERROR GetArtistPics 2: " + e.message + " | " + e.number + " | " + e.name);
					}
				}
				xmlhttp.send();
			}
		} catch(e) {
			fb.trace("ERROR GetArtistPics 3: " + e.message + " | " + e.number + " | " + e.name);
		}
	}

	this.get_album_pic = function (artist, album, metadb) {
		var params = {
				"method"      : "album.getInfo",
				"artist"      : encodeURIComponent(artist),
				"album"       : encodeURIComponent(album),
				"autocorrect" : lastfm.auto_correct ? 1 : 0
			},
			msgbox_title = "下载封面图片";
			
		connect(params, function(data) {
			if (typeof data.error != "undefined") {
				MsgBox(sprintf(__("下载失败。\n返回信息：%s"), data.message), false, msgbox_title);
			} else {
				var images = data.album.image,
					url = "";
				for (var i = 0; i < images.length; i++) {
					if (images[i]["size"] == "mega") {
						url = images[i]["#text"];
					}
				}
				if (url) {
					var filename = metadb.RawPath.replace("file://", "").replace(metadb.RawPath.slice(metadb.RawPath.lastIndexOf("\\")), "") + "\\" + sf(artist + " - " + album) + url.slice(url.lastIndexOf("."));
					lastfm.download_pic(url, filename, msgbox_title);
				} else {
					MsgBox(__("没有图片可供下载。"), false, msgbox_title);
				}
			}
		}, function(message){
			MsgBox(sprintf(__("下载失败。\n返回信息：%s"), message), false, msgbox_title);
		});
	}

	this.download_pic = function(url, filename, msgbox_title) {
		try {
			if (utils.FileTest(filename, "e")) {
				if (MsgBox(__("文件已存在，是否继续下载并覆盖？"), true, msgbox_title) != 1) {
					return false;
				}
			}
			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.open("GET", url, false);
			xmlhttp.send();
			if (xmlhttp.status == 200) {
				var name = filename.slice(filename.lastIndexOf("\\")).replace("\\", "")
					path = filename.replace(name, "")
				save_binary_file(filename, xmlhttp.responseBody);
				if (MsgBox(sprintf(__("图片 %s 下载完成，文件保存在曲目所在文件夹。\n是否打开文件夹？"), name), true, msgbox_title) == 1) {
					WshShell.run(path);
				}
				return true;
			} else {
				message = __("与 Last.fm 服务器连接时发生错误。") + "\n" + (xmlhttp.responsetext || __("HTTP 错误: ") + xmlhttp.status);
				MsgBox(message, false, msgbox_title);
			}
		} catch(e) {
			MsgBox(sprintf(__("下载失败。\n返回信息：%s"), e.message + " | " + e.number + " | " + e.name), false, msgbox_title);
			return false;
		}
	}

	this.set_account = function() {
		function set_username() {
			username_temp = InputBox(__("用户名"), __("设置 Last.fm 账户"), username);
			if (username_temp != "") {
				set_password(username_temp);
			}
		}
		function set_password(username_temp) {
			password_temp = InputBox(__("密码（不保存）"), __("设置 Last.fm 账户"), "");
			if (password_temp != '') {
				lastfm.auth(username_temp, password_temp);
			}
		}
		set_username();
	}

	this.open_profile_page = function() {
			try {
				WshShell.run("http://www.last.fm/user/" + encodeURIComponent(username));
			} catch(e) {
				MsgBox(__("无法打开你的默认浏览器。"));
			}
		}
}
var lastfm = new lastfm({
	"api_key"             : lastfm_api_key,
	"api_secret"          : lastfm_api_secret,
	"username"            : read(lastfm_username_file),
	"sk"                  : read(lastfm_sk_file),
	"auto_correct"        : window.GetProperty("auto_correct", false),
	"username_file"       : lastfm_username_file,
	"sk_file"             : lastfm_sk_file,
	"sqlite_exe"          : lastfm_sqlite_exe,
	"database_file"       : lastfm_database_file,
	"scrobble_cache_file" : lastfm_scrobble_cache_file,
	"scrobble_cache"      : read(lastfm_scrobble_cache_file),
	"import_cmd"          : lastfm_import_cmd,
	"sql_file"            : lastfm_sql_file,
	"retry_delay"         : lastfm_retry_delay
});


function get_timestamp() {
	return Math.round(new Date().getTime()/1000);
}

function sync_selection_changed() {
	try  {
		gs_metadb.Count;
	} catch(e) {
		return false;
	}
	gs_metadb_new = fb.GetSelections();
	try  {
		gs_metadb_new.Count;
	} catch(e) {
		return false;
	}
	gs_metadb_new.Sort();
	gs_tracks_old = gs_tracks;
	gs_tracks_new = {};
	for (i=0;i<gs_metadb.Count;i++) {
		try  {
			gs_metadb_new.Item(i);
		} catch(e) {
			continue;
		}
		gs_metadb_new_item = gs_metadb_new.Item(i);
		gs_track_new_crc32 = fb.TitleFormat("$crc32($lower(%artist%	%title%))").EvalWithMetadb(gs_metadb_new_item);
		gs_track_new_loved = fb.TitleFormat("%LASTFM_LOVED%").EvalWithMetadb(gs_metadb_new_item) == 1 ? 1 : 0;
		if (typeof gs_tracks[gs_track_new_crc32] != "undefined" &&  gs_tracks[gs_track_new_crc32]["loved"] != gs_track_new_loved) {
			if (!lastfm.send_love_track(fb.TitleFormat("%artist%").EvalWithMetadb(gs_metadb_new_item), fb.TitleFormat("%title%").EvalWithMetadb(gs_metadb_new_item), gs_track_new_loved, gs_metadb_new_item)) {
				fb.RunContextCommandWithMetadb(gs_track_new_loved == 1 ? __("设为喜爱曲目") : __("从喜爱曲目中删除"), gs_metadb_new_item);
			}
		}
	}
	on_selection_changed();
}

function get_window_size() {
	if (start <= 5) {
		start++;
		return;
	}
    if (ww() > compact_mode_ww || wh() > compact_mode_wh) {
		if (ww() < screen_w - wbs * 2 && wh() < screen_h - wbs * 2) {
			g_ww = ww();
			g_wh = wh();
			window.SetProperty("g_ww", g_ww);
			window.SetProperty("g_wh", g_wh);
			window.NotifyOthers("g_ww", g_ww);
			window.NotifyOthers("g_wh", g_wh);
		}
    }
}

function window_maximize() {
    if (!in_rating && !in_lastfm && !in_prev && !in_next && !in_play_pause && !in_volume) {
		if (ww() == screen_w && wh() == screen_h) {
			utils.MoveWindowW(hWnd, g_wx, g_wy, c_ww, c_wh);
		} else {
			c_ww = ww();
			c_wh = wh();
			window.SetProperty("c_ww", c_ww);
			window.SetProperty("c_wh", c_wh);
			g_wx = wx();
			g_wy = wy();
			window.SetProperty("g_wx", g_wx);
			window.SetProperty("g_wy", g_wy);
			window.NotifyOthers("g_ww", g_ww);
			window.NotifyOthers("g_wh", g_wh);
			utils.MoveWindowW(hWnd, -wbs, -wbs, screen_w, screen_h);
		}
    }
}

function paint_button() {
	get_el_position();
	_Buttons_.play           = new Button(icon_play_pause_x, icon_play_pause_y, icon_play_w, icon_play_h, {normal: icon_play, hover: icon_play_hover, pressed: icon_play_pressed}, function(){
		fb.Play();
	});
	_Buttons_.pause          = new Button(icon_play_pause_x, icon_play_pause_y, icon_pause_w, icon_pause_h, {normal: icon_pause, hover: icon_pause_hover, pressed: icon_pause_pressed}, function(){
		fb.Pause();
	});

	_Buttons_.prev           = new Button(icon_prev_x, icon_prev_y, icon_prev_w, icon_prev_h, {normal: icon_prev, hover: icon_prev_hover, pressed: icon_prev_pressed}, function(){
		fb.Prev();
	})
	_Buttons_.next           = new Button(icon_next_x, icon_next_y, icon_next_w, icon_next_h, {normal: icon_next, hover: icon_next_hover, pressed: icon_next_pressed}, function(){
		fb.Next();
	})

	_Buttons_.unrated        =  new Button(icon_rating_x, icon_rating_y, icon_rating_w, icon_rating_h, {normal: icon_rating, hover: icon_rating_hover, pressed: icon_rating_pressed}, function(){
		fb.RunContextCommandWithMetadb(__("播放统计信息/等级/5"), np_metadb);
		on_metadb_changed();
	});
	_Buttons_.rated          =  new Button(icon_rating_x, icon_rating_y, icon_rating_w, icon_rating_h, {normal: icon_rating_on, hover: icon_rating_on_hover, pressed: icon_rating_on_pressed}, function(){
		fb.RunContextCommandWithMetadb(__("播放统计信息/等级/<不设置>"), np_metadb);
		on_metadb_changed();
	});

	_Buttons_.lastfm_na      = new Button(icon_lastfm_x, icon_lastfm_y, icon_lastfm_w, icon_lastfm_h, {normal: icon_lastfm_na}, function(){
		lastfm.check_env(true);
	});
	_Buttons_.lastfm_loading = new Button(icon_lastfm_x, icon_lastfm_y, icon_lastfm_w, icon_lastfm_h, {normal: icon_lastfm_loading});
	_Buttons_.lastfm_unloved = new Button(icon_lastfm_x, icon_lastfm_y, icon_lastfm_w, icon_lastfm_h, {normal: icon_lastfm, hover: icon_lastfm_hover, pressed: icon_lastfm_pressed}, function(){
		if (np_metadb && np_track.artist && np_track.track) {
			lastfm.send_love_track(np_track.artist, np_track.track, 1, np_metadb, true);
		}
	});
	_Buttons_.lastfm_loved   = new Button(icon_lastfm_x, icon_lastfm_y, icon_lastfm_w, icon_lastfm_h, {normal: icon_lastfm_on, hover: icon_lastfm_on_hover, pressed: icon_lastfm_on_pressed}, function(){
		if (np_metadb && np_track.artist && np_track.track) {
			lastfm.send_love_track(np_track.artist, np_track.track, 0, np_metadb, true);
		}
	});


	_Buttons_.repeat_track_on = new Button(icon_repeat_x, icon_repeat_y, icon_repeat_w, icon_repeat_h, {normal: icon_repeat_track_on, hover: icon_repeat_track_on_hover, pressed: icon_repeat_track_on_pressed}, function(){
		fb.PlaybackOrder = 0;
	});
	_Buttons_.repeat_on       = new Button(icon_repeat_x, icon_repeat_y, icon_repeat_w, icon_repeat_h, {normal: icon_repeat_on, hover: icon_repeat_on_hover, pressed: icon_repeat_on_pressed}, function(){
		fb.PlaybackOrder = 2;
	});
	_Buttons_.repeat          = new Button(icon_repeat_x, icon_repeat_y, icon_repeat_w, icon_repeat_h, {normal: icon_repeat, hover: icon_repeat_hover, pressed: icon_repeat_pressed}, function(){
		fb.PlaybackOrder = 1;
	});
	_Buttons_.shuffle_on      = new Button(icon_shuffle_x, icon_shuffle_y, icon_shuffle_w, icon_shuffle_h, {normal: icon_shuffle_on, hover: icon_shuffle_on_hover, pressed: icon_shuffle_on_pressed}, function(){
		fb.PlaybackOrder = 0;
	});
	_Buttons_.shuffle         = new Button(icon_shuffle_x, icon_shuffle_y, icon_shuffle_w, icon_shuffle_h, {normal: icon_shuffle, hover: icon_shuffle_hover, pressed: icon_shuffle_pressed}, function(){
		fb.PlaybackOrder = 4;
	});

	if (np_metadb) {
		Buttons.rating = np_track_prop.rating > 0 ? _Buttons_.rated : _Buttons_.unrated;
		Buttons.prev   = _Buttons_.prev;
		Buttons.next   = _Buttons_.next;
	}

	set_playback_order_button();
	set_lastfm_button();
}

function set_playback_order_button() {
    var order = fb.PlaybackOrder;
	if (order < 3 && order > 0) {
		if (order == 2) {
			Buttons.repeat = _Buttons_.repeat_track_on;
		} else {
			Buttons.repeat = _Buttons_.repeat_on;
		}
	} else {
		Buttons.repeat = _Buttons_.repeat;
	}
	if (order > 3) {
		Buttons.shuffle = _Buttons_.shuffle_on;
	} else {
		Buttons.shuffle = _Buttons_.shuffle;
	}
    window.Repaint();
}

function set_lastfm_button() {
	if (np_metadb) {
		if (lastfm.check_env()) {
			Buttons.lastfm = np_track_prop.loved == 1 ? _Buttons_.lastfm_loved : _Buttons_.lastfm_unloved;
		} else {
			Buttons.lastfm = _Buttons_.lastfm_na;
		}
	}
    window.Repaint();
}

function get_now_playing() {
	np_metadb = fb.GetNowPlaying();
	if (np_metadb) {
		np_track  = {
			"artist"      : fb.TitleFormat("%artist%").EvalWithMetadb(np_metadb),
			"track"       : fb.TitleFormat("%title%").EvalWithMetadb(np_metadb),
			"album"       : fb.TitleFormat("%album%").EvalWithMetadb(np_metadb),
			"albumArtist" : fb.TitleFormat("%album artist%").EvalWithMetadb(np_metadb),
			"trackNumber" : parseInt(fb.TitleFormat("%tracknumber%").EvalWithMetadb(np_metadb)),
			"duration"    : parseInt(fb.TitleFormat("%length_seconds%").EvalWithMetadb(np_metadb))
		};
		if (!np_track.trackNumber) {
			delete np_track.trackNumber;
		}
		if (!np_track.album) {
			delete np_track.album;
		}
		if (!np_track.albumArtist) {
			delete np_track.albumArtist;
		}
		if (!np_track.duration) {
			delete np_track.duration;
		}
		np_track_loved     = fb.TitleFormat("%LASTFM_LOVED%").EvalWithMetadb(np_metadb) == 1 ? 1 : 0;
		np_track_playcount = parseInt(fb.TitleFormat("%LASTFM_PLAYCOUNT%").EvalWithMetadb(np_metadb));
		np_track_playcount = np_track_playcount > 0 ? np_track_playcount : 0;
		np_track_crc32     = fb.TitleFormat("$crc32($lower(%artist%	%title%))").EvalWithMetadb(np_metadb);
		np_rating          = fb.TitleFormat("%rating%").EvalWithMetadb(np_metadb);
		np_rating          = np_rating == "?" ? 0 : np_rating;
		
		np_track_prop = {
			"loved"     : np_track_loved,
			"playcount" : np_track_playcount,
			"crc32"     : np_track_crc32,
			"rating"    : np_rating
		};
	}
}

function pos2vol(p) {
     return (50 * Math.log(0.99 * p + 0.01) / Math.log(10));
}

function vol2pos(v){
	var p=((Math.pow(10,v/50)-0.01)/0.99);
	return(p);
}

function on_window_resize() {
	pw                    = window.Width;
	ph                    = window.Height;

    get_window_size();
	get_el_position();

	_Buttons_.prev.x      = icon_prev_x;
	_Buttons_.prev.y      = icon_prev_y;
	_Buttons_.next.x      = icon_next_x;
	_Buttons_.next.y      = icon_next_y;

	_Buttons_.play.x      = _Buttons_.pause.x = icon_play_pause_x;
	_Buttons_.play.y      = _Buttons_.pause.y = icon_play_pause_y;
	_Buttons_.unrated.x   = _Buttons_.rated.x = icon_rating_x;
	_Buttons_.unrated.y   = _Buttons_.rated.y = icon_rating_y;
	_Buttons_.lastfm_na.x = _Buttons_.lastfm_loading.x = _Buttons_.lastfm_unloved.x = _Buttons_.lastfm_loved.x = icon_lastfm_x;
	_Buttons_.lastfm_na.y = _Buttons_.lastfm_loading.y = _Buttons_.lastfm_unloved.y = _Buttons_.lastfm_loved.y = icon_lastfm_y;

	_Buttons_.repeat.x    = _Buttons_.repeat_on.x = _Buttons_.repeat_track_on.x = icon_repeat_x;
	_Buttons_.repeat.y    = _Buttons_.repeat_on.y = _Buttons_.repeat_track_on.y = icon_repeat_y;
	_Buttons_.shuffle.x   = _Buttons_.shuffle_on.x = icon_shuffle_x;
	_Buttons_.shuffle.y   = _Buttons_.shuffle_on.y = icon_shuffle_y;

    window.Repaint();
}

function on_timer(id) {
	var timestamp = get_timestamp();

	if (timestamp == lastfm.send_scrobble_next) {
		lastfm.send_scrobble();
	}
	
	if (timestamp == lastfm.send_now_playing_next) {
		if (np_metadb && np_track.artist && np_track.track) {
			lastfm.send_now_playing(np_track, np_track_prop, np_metadb);
		}
	}
}

function on_metadb_changed() {
	switch(true) {
		case lastfm.sync_track_working == true:
			lastfm.sync_track_working = false;
			break;
		case lastfm.now_playing_loved_working == true:
			lastfm.now_playing_loved_working = false;
			break;
		default:
			sync_selection_changed();
			break;
	}
	if (fb.IsPlaying || fb.IsPaused) {
		get_now_playing();
	}
	if (np_metadb) {
		Buttons.prev   = _Buttons_.prev;
		Buttons.next   = _Buttons_.next;
		Buttons.rating = np_track_prop.rating > 0 ? _Buttons_.rated : _Buttons_.unrated;
	} else {
		buttonsRemove("prev");
		buttonsRemove("next");
		buttonsRemove("rating");
	}
	set_lastfm_button()
    window.Repaint();
}

function on_paint(gr){
    gr.FillSolidRect(0, 0, pw, ph, RGB(255,255,255));

	if (volumebar_w_d > 0) {
		var volume_pos = parseInt(vol2pos(fb.Volume) * volumebar_w_d);
		gr.FillSolidRect(volumebar_x, volumebar_y + 4, volumebar_w_d, 3, RGBA(229,229,229,255));
		gr.FillSolidRect(volumebar_x, volumebar_y + 4, volume_pos, 3, RGBA(51,51,51,255));
		gr.FillSolidRect(volumebar_x + volume_pos, volumebar_y + 4, 2, 3, RGBA(255,255,255,255));
		gr.DrawImage(gdi.Image(icon_volume_hover), icon_volume_x - 6, icon_volume_y, icon_volume_w, icon_volume_h, 0, 0, icon_volume_w, icon_volume_h);
	} else {
		gr.DrawImage(gdi.Image(icon_volume), icon_volume_x, icon_volume_y, icon_volume_w, icon_volume_h, 0, 0, icon_volume_w, icon_volume_h);
	}


	if (fb.IsPlaying | fb.IsPaused) {
		//if (!volumebar_w_d) {
			gr.SetSmoothingMode(4);
			g_textrender.GlowText(RGBA(102, 102, 102, 255), RGBA(255, 255, 255, 255), 2);
			g_textrender.RenderStringRect(gr, "-" + TimeFmt(fb.PlaybackLength - fb.PlaybackTime), font_time, text_time_x, text_time_y, 100, font_size_time, StringFormat(0, 1, 3, 0x1000));
		//}

	    text_artist = fb.TitleFormat("[%artist%]").Eval();
	    text_album  = fb.TitleFormat("[%album%]").Eval();
	    text_year   = fb.TitleFormat("[%date%]").Eval();
	    text_title  = fb.TitleFormat("[%title%]").Eval();

	    gr.SetSmoothingMode(4);
		g_textrender.OutLineText(RGBA(51, 51, 51, 255), RGBA(255, 255, 255, 255), 2);
		g_textrender.RenderStringRect(gr, text_artist, font_artist, text_artist_x, text_artist_y, pw-20, font_size_artist, StringFormat(0, 1, 3, 0x1000));
		g_textrender.RenderStringRect(gr, text_album, font_album, text_album_x, text_album_y, pw-20, font_size_album, StringFormat(0, 1, 3, 0x1000));

		g_textrender.OutLineText(RGBA(108, 113, 114, 255), RGBA(255, 255, 255, 255), 2);
		g_textrender.RenderStringRect(gr, text_year, font_year, text_year_x, text_year_y, pw-20, font_size_year, StringFormat(0, 1, 3, 0x1000));

	    g_textrender.OutLineText(RGBA(0, 153, 102, 255), RGBA(255, 255, 255, 255), 2);
		g_textrender.RenderStringRect(gr, text_title, font_title, text_title_x, text_title_y, pw-20, font_size_title, StringFormat(0, 1, 3, 0x1000));

	} else {
	    text_title = __("无曲目");
	    gr.SetSmoothingMode(4);
		g_textrender.OutLineText(RGBA(108, 113, 114, 255), RGBA(255, 255, 255, 255), 2);
		g_textrender.RenderStringRect(gr, text_title, font_title, text_title_x, text_title_y, pw-20, font_size_title, StringFormat(0, 1, 3, 0x1000));
	}

    Buttons.play_pause = fb.IsPlaying ? (fb.IsPaused ? _Buttons_.play : _Buttons_.pause) : _Buttons_.play;

	buttonsDraw(gr);
}

function on_mouse_lbtn_down(x, y) {
	if (volumebar_w_d > 0) {
		volume_drag = 1;
	}
	if (in_rating || in_lastfm || in_prev || in_next || in_play_pause || in_volume) {
		mouse_down_c = true;
	}
	mouse_down = true;
	mouse_down_x = x;
	mouse_down_y = y;
	buttonsDown(x, y);
}

function on_mouse_lbtn_up(x, y) {
	if (volumebar_w_d > 0) {
		set_volume(x, y);
		volume_drag = 0;
	}
	if (in_title) {
		fb.RunMainMenuCommand(__("视图/ELPlaylist/显示正在播放"));
	}
	mouse_down = mouse_down_c = false;
	buttonsUp(x, y);
    window.Repaint();
}

function on_mouse_lbtn_dblclk(x, y, mask) {
	mouse_down = mouse_down_c = false;
	if (!in_rating && !in_lastfm && !in_prev && !in_next && !in_play_pause && !in_volume) {
		window_maximize();
	}
}

function on_mouse_mbtn_up(x, y) {
	if (ww() == compact_mode_ww && wh() == compact_mode_wh) {
		utils.MoveWindowW(hWnd, wx() + g_ww > screen_w ? screen_w - g_ww : wx(), wy() + g_wh > screen_h ? screen_h - g_wh : wy(), g_ww < switch_mode_ww ? switch_mode_ww : g_ww, g_wh < switch_mode_wh ? switch_mode_wh : g_wh);
	} else {
		if (ww() == screen_w && wh() == screen_h) {
			utils.MoveWindowW(hWnd, g_wx,  g_wy, compact_mode_ww, compact_mode_wh);
		} else {
			utils.MoveWindowW(hWnd, wx(), wy(), compact_mode_ww, compact_mode_wh);
		}
	}
}

function on_mouse_move(x,y){
	in_play_pause = (x >= icon_play_pause_x && x <= icon_play_pause_x+icon_play_w && y >= icon_play_pause_y && y <= icon_play_pause_y+icon_play_h) ? true : false;
	in_volume     = (x >= icon_volume_x && x <= icon_volume_x+icon_volume_w+volumebar_w_d && y >= icon_volume_y && y <= icon_volume_y+icon_volume_h) ? true : false;
	if (fb.IsPlaying | fb.IsPaused) {
		in_prev       = (x >= icon_prev_x && x <= icon_prev_x+icon_prev_w && y >= icon_prev_y && y <= icon_prev_y+icon_prev_h) ? true : false;
		in_next       = (x >= icon_next_x && x <= icon_next_x+icon_next_w && y >= icon_next_y && y <= icon_next_y+icon_next_h) ? true : false;
		in_rating     = (x >= icon_rating_x && x <= icon_lastfm_x+icon_lastfm_w && y >= icon_rating_y && y <= icon_rating_y+icon_rating_h) ? true : false;
		in_lastfm     = (x >= icon_lastfm_x && x <= icon_lastfm_x+icon_lastfm_w && y >= icon_lastfm_y && y <= icon_lastfm_y+icon_lastfm_h) ? true : false;
		in_title      = (x >= text_title_x && x <= text_title_x+(pw-20) && y >= text_title_y && y <= text_title_y+font_size_title) ? true : false;
	}

    if (mouse_down && (mouse_down_x != x || mouse_down_y != y) && !mouse_down_c) {
		mouse_down = false;
		if (ww() == screen_w && wh() == screen_h) {
			utils.MoveWindowW(hWnd, mouse_down_x + 245 - c_ww/2, wy(), c_ww, c_wh);
		}
        utils.ReleaseCapture_();
        utils.SendAMessage(hWnd, 0xA1, 2, 0);
    }

	if (in_volume || volume_drag) {
		volumebar_w_d = volumebar_w;
		get_el_position()
		window.RepaintRect(icon_volume_x, icon_volume_y, icon_volume_x + icon_volume_w + volumebar_w_d, icon_volume_h);
	} else {
		volumebar_w_d = volume_drag = 0;
		get_el_position()
	}

    if (volume_drag) {
		set_volume(x, y);
    }

    buttonsMove(x, y);
    window.Repaint();
}

function set_volume(x, y) {
	var vx = x - volumebar_x;
	var p = (x < volumebar_x) ? 0 : (vx/volumebar_w_d);
	var v = pos2vol(p);
	if (fb.Volume != v) {
		fb.Volume = v;
	}
}

function on_mouse_wheel(step){
	if (volumebar_w_d > 0) {
		if(step>0)
			fb.VolumeUp();
		else
			fb.VolumeDown();
	}
}

function on_volume_change(val){
	window.RepaintRect(text_time_x, text_time_y, icon_volume_x + icon_volume_w + volumebar_w_d, icon_volume_h);
}

function on_mouse_leave(){
	volumebar_w_d = volume_drag = 0;
	mouse_down = mouse_down_c = false;
	buttonsLeave();
    window.Repaint();
}

function on_playback_new_track(info){
	get_now_playing();
	if (np_metadb) {
		Buttons.rating = np_track_prop.rating > 0 ? _Buttons_.rated : _Buttons_.unrated;
	}
	set_lastfm_button();
	time_elapsed = 0;
	switch(true) {
		case fb.PlaybackLength == 0:
			target_time = 240;
			break;
		case fb.PlaybackLength >= 30:
			target_time = Math.min(Math.floor(fb.PlaybackLength / 2), 240);
			break;
		default:
			target_time = 5;
			break;
	}
	on_item_focus_change();
	if (np_metadb && np_track.artist && np_track.track) {
		lastfm.send_now_playing(np_track, np_track_prop, np_metadb);
	}
	window.Repaint();
}

function on_playback_time(time) {
	time_elapsed++;
	if (np_metadb && np_track.artist && np_track.track && time_elapsed == 3 && auto_love && fb.TitleFormat(auto_love_tf).Eval() == 1 && np_track_prop.loved == 0) {
		console_output(__("自动将当前播放曲目设为喜爱曲目..."));
		lastfm.send_love_track(np_track.artist, np_track.track, (np_track_loved == 1 ? 0 : 1), np_metadb);
	}
	window.RepaintRect(text_time_x, text_time_y, icon_volume_x + icon_volume_w + volumebar_w_d, icon_volume_h);
}

function on_playback_seek(time){
	window.RepaintRect(text_time_x, text_time_y, icon_volume_x + icon_volume_w + volumebar_w_d, icon_volume_h);
}

function on_item_played(metadb) {
	if (np_metadb && np_track.artist && np_track.track) {
		lastfm.update_scrobble_queue(np_track);
	}
	lastfm.send_scrobble();
	fb.RunContextCommandWithMetadb(__("重置播放次数"), metadb);
	var sql = '\"INSERT OR REPLACE INTO quicktag(url,subsong,fieldname,value) VALUES(\\"' + np_track_prop.crc32 + '\\",\\"-1\\",\\"LASTFM_PLAYCOUNT\\",\\"' + (np_track_prop.playcount + 1) + '\\")\";';
	WshShell.Run(fso.GetFile(lastfm.sqlite_exe).ShortPath + " " + fso.GetFile(lastfm.database_file).ShortPath + " " + sql, 0, true);
	fb.RunContextCommandWithMetadb(__("刷新播放次数"), metadb);
}

function on_playback_starting(cmd, is_paused) {
	Buttons.play_pause = _Buttons_.pause;
	Buttons.prev   = _Buttons_.prev;
	Buttons.next   = _Buttons_.next;
    window.Repaint();
}

function on_playback_pause(state) {
	if (state) {
		Buttons.play_pause = _Buttons_.play;
	} else {
		Buttons.play_pause = _Buttons_.pause;
		if (np_metadb && np_track.artist && np_track.track) {
			lastfm.send_now_playing(np_track, np_track_prop, np_metadb);
		}
	}
	set_lastfm_button();
	window.Repaint();
}

function on_playback_stop() {
	np_metadb = null;
	Buttons.play_pause  = _Buttons_.play;
	buttonsRemove("prev");
	buttonsRemove("next");
	buttonsRemove("rating");
	buttonsRemove("lastfm");
    window.Repaint();
}

function on_item_focus_change() {
	fi_metadb = fb.GetFocusItem();
	set_lastfm_button();
}

function on_selection_changed() {
	window.UnwatchMetadb();
	gs_metadb = fb.GetSelections();
	gs_metadb.Sort();
	gs_tracks = {};
	for (i=0;i<gs_metadb.Count;i++) {
		gs_tracks[fb.TitleFormat("$crc32($lower(%artist%	%title%))").EvalWithMetadb(gs_metadb.Item(i))] = {
			"track" : encodeURIComponent(fb.TitleFormat("%title%").EvalWithMetadb(gs_metadb.Item(i))),
			"artist": encodeURIComponent(fb.TitleFormat("%artist%").EvalWithMetadb(gs_metadb.Item(i))),
			"loved": fb.TitleFormat("%LASTFM_LOVED%").EvalWithMetadb(gs_metadb.Item(i)) == 1 ? 1 : 0
		}
		window.WatchMetadb(gs_metadb.Item(i));
	}
	on_item_focus_change();
}

function on_playlist_switch() {
	on_selection_changed();
}

function on_playback_order_changed(index) {
	set_playback_order_button();
	window.Repaint();
}

function on_notify_data(name, data) {
	if (name == "lastfm_update" && data == 1) {
		lastfm.sync_loved_working = false;
		lastfm.sync_playcount_working = false;
	}
	if (name == "resize" && data == true) {
		on_window_resize();
	}
}

get_window_size();
get_now_playing();
paint_button();

if (lastfm.check_env()) {
	lastfm.send_scrobble();
}

on_item_focus_change();

if (fb.IsPlaying) {
	on_playback_new_track();
}
