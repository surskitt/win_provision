// @name      Window Resize Control
// @version   0.2
// @copyright Eric Chu (eric@mozest.com)

var hWnd = utils.GetHWND("{E7076D1C-A7BF-4f39-B771-BCBE88F2A2A8}");
if (utils.IsGlassEnabled()) {
    utils.CreateGlass(hWnd, 6, 6, 6, 6);
}

var MK_SHIFT        = 0x0004;

var skin_path       = fb.FoobarPath + "skins\\musikarte\\";
var image_path      = skin_path + "images\\";

var image_border    = gdi.Image(image_path + "\\border.png");

var wbs             = 6;

var screen_w        = utils.GetSystemMetrics(16) + wbs * 2,
	screen_h        = utils.GetSystemMetrics(17) + utils.GetSystemMetrics(4) + 12 + wbs * 2;

var compact_mode_ww = 572,
	compact_mode_wh = 257,
	normal_mode_ww  = 1030,
	normal_mode_wh  = 800,
	switch_mode_ww  = 1000,
	switch_mode_wh  = 770;

var in_corner_lt    = in_corner_rb = in_corner_tr = in_corner_bl = in_border_t = in_border_b = in_border_r = in_border_l = false,
	in_corner_lt_x  = in_corner_rb_x = in_corner_tr_x = in_corner_bl_x = in_border_r_x = in_border_l_x = null,
	in_corner_lt_y  = in_corner_rb_y = in_corner_tr_y = in_corner_bl_y = in_border_t_y = in_border_b_y = null;

var orig_x          = orig_y = null,
	orig_w          = orig_h = null;

var corner_s        = 12
	border_s        = 12;

var ww = function() {return utils.GetWindowInfoW(hWnd, 3) - utils.GetWindowInfoW(hWnd, 2)},
	wh = function() {return utils.GetWindowInfoW(hWnd, 4) - utils.GetWindowInfoW(hWnd, 1)},
	wx = function() {return utils.GetWindowInfoW(hWnd, 2)},
	wy = function() {return utils.GetWindowInfoW(hWnd, 1)},
	pw = function() {return window.Width},
	ph = function() {return window.Height};

var g_ww = normal_mode_ww,
	g_wh = normal_mode_wh;

var corner_lt_x,
	corner_lt_y,
	corner_tr_x,
	corner_tr_y,
	corner_rb_x,
	corner_rb_y,
	corner_bl_x,
	corner_bl_y,
	border_t_x,
	border_t_y,
	border_t_w,
	border_t_h,
	border_r_x,
	border_r_y,
	border_r_w,
	border_r_h,
	border_b_x,
	border_b_y,
	border_b_w,
	border_b_h,
	border_l_x,
	border_l_y,
	border_l_w,
	border_l_h;

function get_el_prop() {
	corner_lt_x = corner_lt_y = corner_tr_y = corner_bl_x = border_t_y = border_l_x = 0;
	corner_tr_x = corner_rb_x = border_r_x  = pw() - corner_s;
	corner_rb_y = corner_bl_y = border_b_y  = ph() - corner_s;
	border_t_x  = border_l_y  = border_r_y  = border_b_x  = corner_s;
	border_t_w  = border_b_w  = pw() - corner_s * 2;
	border_t_h  = border_r_w  = border_b_h  = border_l_w  = border_s;
	border_r_h  = border_l_h  = ph() - corner_s * 2;
}

function on_size() {
	window.NotifyOthers("resize", true);
    window.Repaint();
}

function on_notify_data(name, data) {
	if (name == "g_ww") {
		g_ww = data;
	}
	if (name == "g_wh") {
		g_wh = data;
	}
}

function RGB(r, g, b) {
	return (0xff000000 | (r << 16) | (g << 8) | (b));
}

function on_paint(gr) {
	gr.FillSolidRect(0, 0, pw(), ph(), RGB(0,0,0));

	get_el_prop();

	gr.DrawImage(image_border, corner_lt_x, corner_lt_y, corner_s, corner_s, 0, 0, corner_s, corner_s);
	gr.DrawImage(image_border, corner_tr_x, corner_tr_y, corner_s, corner_s, 24, 0, corner_s, corner_s);
	gr.DrawImage(image_border, corner_rb_x, corner_rb_y, corner_s, corner_s, 24, 24, corner_s, corner_s);
	gr.DrawImage(image_border, corner_bl_x, corner_bl_y, corner_s, corner_s, 0, 24, corner_s, corner_s);
	
	gr.DrawImage(image_border, border_t_x, border_t_y, border_t_w, border_t_h, 12, 0, corner_s, corner_s);
	gr.DrawImage(image_border, border_r_x, border_r_y, border_r_w, border_r_h, 24, 12, corner_s, corner_s);
	gr.DrawImage(image_border, border_b_x, border_b_y, border_b_w, border_b_h, 12, 24, corner_s, corner_s);
	gr.DrawImage(image_border, border_l_x, border_l_y, border_l_w, border_l_h, 0, 12, corner_s, corner_s);
}

function on_mouse_lbtn_down(x, y) {
	orig_x = wx();
	orig_y = wy();
	orig_w = ww();
	orig_h = wh();
	//top border
	if (in_border_t) {
		in_border_t_y = y;
	}
	//right border
	if (in_border_r) {
		in_border_r_x =  6 - (x - (orig_w - 6));
	}
	//bottom border
	if (in_border_b) {
		in_border_b_y =  6 - (y - (orig_h - 6));
	}
	//left border
	if (in_border_l) {
		in_border_l_x = x;
	}

	//left top corner
	if (in_corner_lt) {
		in_corner_lt_x = x;
		in_corner_lt_y = y;
	}
	//top right corner
	if (in_corner_tr) {
		in_corner_tr_x =  6 - (x - (orig_w - 6));
		in_corner_tr_y = y;
	}
	//right bottm corner
	if (in_corner_rb) {
		in_corner_rb_x =  6 - (x - (orig_w - 6));
		in_corner_rb_y =  6 - (y - (orig_h - 6));
	}
	//bottom left corner
	if (in_corner_bl) {
		in_corner_bl_x = x;
		in_corner_bl_y =  6 - (y - (orig_h - 6));
	}
}

function on_mouse_lbtn_up(x, y) {
	in_corner_lt_x  = in_corner_rb_x = in_corner_tr_x = in_corner_bl_x = in_border_r_x = in_border_l_x = null;
	in_corner_lt_y  = in_corner_rb_y = in_corner_tr_y = in_corner_bl_y = in_border_t_y = in_border_b_y = null;
	orig_x          = orig_y = null;
	orig_w          = orig_h = null;
}

function on_mouse_move(x, y) {
	if (ww() == screen_w && wh() == screen_h) {
		return;
	}
	in_corner_lt = (x >= 0 && x <= 6 && y >= 0 && y <= 6) ? true : false;
	in_corner_rb = (x >= pw() - 6 && x <= pw() && y >= ph() - 6 && y <= ph()) ? true : false;

	in_corner_tr = (x >= pw() - 6 && x <= pw() && y >= 0 && y <= 6) ? true : false;
	in_corner_bl = (x >= 0 && x <= 6 && y >= ph() - 6 && y <= ph()) ? true : false;

	in_border_t = (x >= 6 && x <= pw() - 6 && y >= 0 && y <= 6) ? true : false;
	in_border_b = (x >= 6 && x <= pw() - 6 && y >= ph() - 6 && y <= ph()) ? true : false;

	in_border_r = (x >= pw() - 6 && x <= pw() && y >= 6 && y <= ph() - 6) ? true : false;
	in_border_l = (x >= 0 && x <= 6 && y >= 6 && y <= ph() - 6) ? true : false;

	if (in_corner_lt || in_corner_rb) {
		window.SetCursor(32642);
	} else if (in_corner_tr || in_corner_bl) {
		window.SetCursor(32643);
	} else if (in_border_t || in_border_b) {
		window.SetCursor(32645);
	} else if (in_border_r || in_border_l) {
		window.SetCursor(32644);
	} else {
		window.SetCursor(32512);
	}
	
	var _ww = ww(),
		_wh = wh(),
		_wx = wx(),
		_wy = wy(),
		_cx = _wx + x,
		_cy = _wy + y;

	//top border
	if (in_border_t_y != null) {
		window.SetCursor(32645);
		rwy = _cy - in_border_t_y;
		rwh = orig_h + (orig_y - (_cy - in_border_t_y));
		if (rwh > compact_mode_wh) {
			if (rwh > switch_mode_wh) {
				utils.MoveWindowW(hWnd, _wx, rwy, g_ww, rwh);
			} else {
				utils.MoveWindowW(hWnd, _wx, orig_y + (orig_h - compact_mode_wh), compact_mode_ww, compact_mode_wh);
			}
		} else {
			utils.MoveWindowW(hWnd, _wx, orig_y + (orig_h - compact_mode_wh), compact_mode_ww, compact_mode_wh);
		}
	}
	//right border
	if (in_border_r_x != null) {
		window.SetCursor(32644);
		rww = _cx - _wx + in_border_r_x;
		if (rww > compact_mode_ww) {
			if (rww > switch_mode_ww) {
				utils.MoveWindowW(hWnd, _wx, _wy, rww, g_wh);
			} else {
				utils.MoveWindowW(hWnd, _wx, _wy, compact_mode_ww, compact_mode_wh);
			}
		} else {
			utils.MoveWindowW(hWnd, _wx, _wy, compact_mode_ww, compact_mode_wh);
		}
	}
	//bottom border
	if (in_border_b_y != null) {
		window.SetCursor(32645);
		rwh = _cy - _wy + in_border_b_y;
		if (rwh > compact_mode_wh) {
			if (rwh > switch_mode_wh) {
				utils.MoveWindowW(hWnd, _wx, _wy, g_ww, rwh);
			} else {
				utils.MoveWindowW(hWnd, _wx, _wy, compact_mode_ww, compact_mode_wh);
			}
		} else {
			utils.MoveWindowW(hWnd, _wx, _wy, compact_mode_ww, compact_mode_wh);
		}
	}
	//left border
	if (in_border_l_x != null) {
		window.SetCursor(32644);
		rwx = _cx - in_border_l_x;
		rww = orig_w + (orig_x - (_cx - in_border_l_x));
		if (rww > compact_mode_ww) {
			if (rww > switch_mode_ww) {
				utils.MoveWindowW(hWnd, rwx, _wy, rww, g_wh);
			} else {
				utils.MoveWindowW(hWnd, orig_x + (orig_w - compact_mode_ww), _wy, compact_mode_ww, compact_mode_wh);
			}
		} else {
			utils.MoveWindowW(hWnd, orig_x + (orig_w - compact_mode_ww), _wy, compact_mode_ww, compact_mode_wh);
		}
	}

	//left top corner
	if (in_corner_lt_x != null && in_corner_lt_y != null) {
		window.SetCursor(32642);
		rwx = _cx - in_corner_lt_x;
		rwy = _cy - in_corner_lt_y;
		rww = orig_w + (orig_x - (_cx - in_corner_lt_x));
		rwh = orig_h + (orig_y - (_cy - in_corner_lt_y));
		if (rww > compact_mode_ww && rwh > compact_mode_wh) {
			if (rww > switch_mode_ww && rwh > switch_mode_wh) {
				utils.MoveWindowW(hWnd, rwx, rwy, rww, rwh);
			} else {
				utils.MoveWindowW(hWnd, orig_x + (orig_w - compact_mode_ww), orig_y + (orig_h - compact_mode_wh), compact_mode_ww, compact_mode_wh);
			}
		} else {
			utils.MoveWindowW(hWnd, orig_x + (orig_w - compact_mode_ww), orig_y + (orig_h - compact_mode_wh), compact_mode_ww, compact_mode_wh);
		}

	}
	//top right corner
	if (in_corner_tr_x != null && in_corner_tr_y != null) {
		window.SetCursor(32643);
		rwy = _cy - in_corner_tr_y;
		rww = _cx - _wx + in_corner_tr_x;
		rwh = orig_h + (orig_y - (_cy - in_corner_tr_y));
		if (rww > compact_mode_ww && rwh > compact_mode_wh) {
			if (rww > switch_mode_ww && rwh > switch_mode_wh) {
				utils.MoveWindowW(hWnd, _wx, rwy, rww, rwh);
			} else {
				utils.MoveWindowW(hWnd, _wx, orig_y + (orig_h - compact_mode_wh), compact_mode_ww, compact_mode_wh);
			}
		} else {
			utils.MoveWindowW(hWnd, _wx, orig_y + (orig_h - compact_mode_wh), compact_mode_ww, compact_mode_wh);
		}
	}
	//right bottm corner
	if (in_corner_rb_x != null && in_corner_rb_y != null) {
		window.SetCursor(32642);
		rww = _cx - _wx + in_corner_rb_x;
		rwh = _cy - _wy + in_corner_rb_y;
		if (rww > compact_mode_ww && rwh > compact_mode_wh) {
			if (rww > switch_mode_ww && rwh > switch_mode_wh) {
				utils.MoveWindowW(hWnd, _wx, _wy, rww, rwh);
			} else {
				utils.MoveWindowW(hWnd, _wx, _wy, compact_mode_ww, compact_mode_wh);
			}
		} else {
			utils.MoveWindowW(hWnd, _wx, _wy, compact_mode_ww, compact_mode_wh);
		}
	}
	//bottom left corner
	if (in_corner_bl_x != null && in_corner_bl_y != null) {
		window.SetCursor(32643);
		rwx = _cx - in_corner_bl_x;
		rww = orig_w + (orig_x - (_cx - in_corner_bl_x));
		rwh = _cy - _wy + in_corner_bl_y;
		if (rww > compact_mode_ww && rwh > compact_mode_wh) {
			if (rww > switch_mode_ww && rwh > switch_mode_wh) {
				utils.MoveWindowW(hWnd, rwx, _wy, rww, rwh);
			} else {
				utils.MoveWindowW(hWnd, orig_x + (orig_w - compact_mode_ww), _wy, compact_mode_ww, compact_mode_wh);
			}
		} else {
			utils.MoveWindowW(hWnd, orig_x + (orig_w - compact_mode_ww), _wy, compact_mode_ww, compact_mode_wh);
		}
	}

    window.Repaint();
}

function on_mouse_rbtn_up(x, y, vkey){
	if (vkey == MK_SHIFT) {
		return;
	} else {
		return true;
	}
}
