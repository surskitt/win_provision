function on_mouse_rbtn_up(x, y, mask) {
	if (mask == MK_SHIFT) {
		var _menu = window.CreatePopupMenu();
		var _midx;
		_menu.AppendMenuItem(MF_STRING, 100, __("控制台输出"));
		_menu.CheckMenuItem(100, show_console);
		_menu.AppendMenuItem(MF_STRING, 200, __("属性"));
		_menu.AppendMenuItem(MF_STRING, 300, __("配置..."));
		_midx = _menu.TrackPopupMenu(x, y);
		switch(_midx) {
			case 100:
				show_console = !show_console;
				window.SetProperty("show_console", show_console);
				break;
			case 200:
				window.ShowProperties();
				break;
			case 300:
				window.ShowConfigure();
				break;
		}
		_menu.Dispose();
	} else {
		_basemenu = window.CreatePopupMenu();
		_context = fb.CreateContextMenuManager();
		_context.InitNowPlaying();
	   
		_child_file        = window.CreatePopupMenu();
		_child_edit        = window.CreatePopupMenu();
		_child_view        = window.CreatePopupMenu();
		_child_playback    = window.CreatePopupMenu();
		_child_library     = window.CreatePopupMenu();
		_child_help        = window.CreatePopupMenu();
		_child_now_playing = window.CreatePopupMenu();
		_child_lastfm      = window.CreatePopupMenu();
		_child_download_artwork = window.CreatePopupMenu();

		_lastfm_child_id   = window.CreatePopupMenu();
		_lastfm_child_al   = window.CreatePopupMenu();
	   
		menuman_file       = fb.CreateMainMenuManager();
		menuman_edit       = fb.CreateMainMenuManager();
		menuman_view       = fb.CreateMainMenuManager();
		menuman_playback   = fb.CreateMainMenuManager();
		menuman_library    = fb.CreateMainMenuManager();
		menuman_help       = fb.CreateMainMenuManager();
	   
		_basemenu.AppendMenuItem(MF_STRING | MF_POPUP, _child_file.ID, __("文件"));
		_basemenu.AppendMenuItem(MF_STRING | MF_POPUP, _child_edit.ID, __("编辑"));
		_basemenu.AppendMenuItem(MF_STRING | MF_POPUP, _child_view.ID, __("视图"));
		_basemenu.AppendMenuItem(MF_STRING | MF_POPUP, _child_playback.ID, __("播放"));
		_basemenu.AppendMenuItem(MF_STRING | MF_POPUP, _child_library.ID, __("媒体库"));
		_basemenu.AppendMenuItem(MF_STRING | MF_POPUP, _child_help.ID, __("帮助"));
		_basemenu.AppendMenuSeparator();
		_basemenu.AppendMenuItem((fb.IsPlaying | fb.IsPaused ? MF_STRING : MF_GRAYED) | MF_POPUP, _child_now_playing.ID, __("正在播放"));
		_basemenu.AppendMenuSeparator();
		_basemenu.AppendMenuItem(MF_STRING | MF_POPUP, _child_lastfm.ID, __("Last.fm"));
		_basemenu.AppendMenuItem((lastfm.check_env() && (fb.IsPlaying | fb.IsPaused) ? MF_STRING : MF_GRAYED) | MF_POPUP, _child_download_artwork.ID, __("从 Last.fm 下载插图"));
		_basemenu.AppendMenuItem(lastfm.check_env() ? MF_STRING : MF_GRAYED, 3000, __("打开你的 Last.fm 个人专页"));

		_child_lastfm.AppendMenuItem(MF_STRING | MF_POPUP, _lastfm_child_id.ID, __("数据导入"));
		_child_lastfm.AppendMenuItem(MF_SEPARATOR, 0, 0);
		_child_lastfm.AppendMenuItem(MF_STRING | MF_POPUP, 1200, __("自动更新时使用 Last.fm 拼写更正"));
		_child_lastfm.CheckMenuItem(1200, lastfm.auto_correct);
		_child_lastfm.AppendMenuItem(MF_STRING | MF_POPUP, _lastfm_child_al.ID, __("自动设为喜爱曲目"));
		_child_lastfm.AppendMenuItem(MF_SEPARATOR, 0, 0);
		_child_lastfm.AppendMenuItem(!lastfm.sync_loved_working && !lastfm.sync_playcount_working ? MF_STRING : MF_GRAYED, 1400, lastfm.check_env() ? __("重新设置 Last.fm 账户") : __("设置 Last.fm 账户"));

		_lastfm_child_id.AppendMenuItem(utils.CheckComponent("foo_customdb", true) && !lastfm.sync_loved_working && !lastfm.sync_playcount_working && fi_metadb && lastfm.check_env() ? MF_STRING : MF_GRAYED, 1101, __("从 Last.fm 下载数据并导入"));
		_lastfm_child_id.AppendMenuItem(utils.CheckComponent("foo_customdb", true) && fso.FileExists(lastfm.sql_file) ? MF_STRING : MF_GRAYED, 1102, __("导入已下载的数据"));

		_lastfm_child_al.AppendMenuItem(MF_STRING, 1301, __("关闭"));
		_lastfm_child_al.AppendMenuItem(MF_SEPARATOR, 0, 0);
		_lastfm_child_al.AppendMenuItem(MF_STRING, 1302, __("开启"));
		_lastfm_child_al.CheckMenuRadioItem(1301, 1302, auto_love ? 1302 : 1301);
		_lastfm_child_al.AppendMenuItem(auto_love ? MF_STRING : MF_GRAYED, 1303, __("设置规则..."));

		_child_download_artwork.AppendMenuItem(MF_STRING | MF_POPUP, 2100, __("下载艺术家图片"));
		_child_download_artwork.AppendMenuItem(MF_STRING | MF_POPUP, 2200, __("下载封面图片"));
	   
		menuman_file.Init("file");
		menuman_edit.Init("edit");
		menuman_view.Init("View");
		menuman_playback.Init("playback");
		menuman_library.Init("library");
		menuman_help.Init("help");
	   
		menuman_file.BuildMenu(_child_file, 1, 100);
		menuman_edit.BuildMenu(_child_edit, 100, 150);
		menuman_view.BuildMenu(_child_view, 200, 200);
		menuman_playback.BuildMenu(_child_playback, 300, 250);
		menuman_library.BuildMenu(_child_library, 400, 300);
		menuman_help.BuildMenu(_child_help, 500, 350);
	   
		_context.InitNowPlaying();
		_context.BuildMenu(_child_now_playing, 600, -1);
		ret = 0;
	   
		ret = _basemenu.TrackPopupMenu(x, y, 0);
	
		if (ret >= 1 && ret<100) {
			menuman_file.ExecuteByID(ret - 1);
		}
		if (ret >= 100 && ret<200) {
			menuman_edit.ExecuteByID(ret - 100);
		}
		if (ret >= 200 && ret<300) {
			menuman_view.ExecuteByID(ret - 200);
		}
		if (ret >= 300 && ret<400) {
			menuman_playback.ExecuteByID(ret - 300);
		}
		if (ret >= 400 && ret<500) {
			menuman_library.ExecuteByID(ret - 400);
		}
		if (ret >= 500 && ret<600)	{
			menuman_help.ExecuteByID(ret - 500);
		}
		if (ret >= 600) {
			_context.ExecuteByID(ret - 600);
		}
		switch(ret) {
			case 1101:
				lastfm.sync_library();
				break;
			case 1102:
				lastfm.import_sql();
				break;
			case 1200:
				lastfm.auto_correct = !lastfm.auto_correct;
				window.SetProperty("auto_correct", lastfm.auto_correct);
				break;
			case 1301:
			case 1302:
				auto_love = ret == 1301 ? false : true;
				window.SetProperty("auto_love", auto_love);
				break;
			case 1303:
				var new_auto_love_tf = InputBox(__("在这里设置的标题格式化的结果等于 1 时将自动设为喜爱曲目。\n\n例如：\n\n$ifequal(%rating%,5,1,0)"), script_name, auto_love_tf);
				auto_love_tf = new_auto_love_tf;
				window.SetProperty("auto_love_tf", auto_love_tf);
				break;
			case 1400:
				lastfm.set_account();
				break;
			case 2100:
				if (np_metadb && np_track.artist) {
					lastfm.get_artist_pic(np_track.artist, np_metadb);
				}
				break;
			case 2200:
				if (np_metadb && np_track.artist && typeof np_track.album != "undefined") {
					lastfm.get_album_pic(np_track.artist, np_track.album, np_metadb);
				}
				break;
			case 3000:
				lastfm.open_profile_page();
				break;
		}
	
		_basemenu.Dispose();
	}
	return true;
}
