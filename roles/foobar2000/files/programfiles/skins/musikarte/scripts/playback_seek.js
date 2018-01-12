var g_drag = 0;
var g_drag_seek = 0;
var padding_left = 0;
var padding_right = 0;

function on_size() {
    pw = window.Width;
    ph = window.Height;
}

function on_paint(gr){
    gr.FillSolidRect(0, 0, pw, ph, RGBA(255,255,255,255));
	var paddings = padding_left + padding_right;
	var bw = pw - paddings;
	var pos = 0;

	//if (fb.IsPlaying || fb.IsPaused) {
		if(fb.PlaybackLength > 0){
			if(g_drag){
				pos = parseInt(bw * g_drag_seek);
			}
			else{
				pos = parseInt(bw * (fb.PlaybackTime/fb.PlaybackLength));
			}
		}
		
		gr.FillSolidRect(0, 4, bw, 2, RGBA(229, 229, 232, 255));
		gr.FillSolidRect(0, 4, pos, 2, RGBA(157,214,197,255));
	//}
}


function on_mouse_lbtn_down(x,y){
	g_drag = (x > padding_left) && (x < pw - padding_right);
}

function on_mouse_lbtn_up(x,y){
	if (g_drag) {
		var bw = pw - padding_left - padding_right;
		g_drag_seek = (x - padding_left)/bw;
		g_drag_seek = (g_drag_seek<0) ? 0 : (g_drag_seek<1) ? g_drag_seek : 1;
		fb.PlaybackTime = fb.PlaybackLength * g_drag_seek;
        g_drag = 0;
    }
}

function on_mouse_move(x,y){
	if(g_drag){
		var bw = pw - padding_left - padding_right;
		g_drag_seek =  (x - padding_left)/bw;
		g_drag_seek = (g_drag_seek<0) ? 0 : (g_drag_seek<1) ? g_drag_seek : 1;
		window.Repaint();
	}
}

function on_mouse_wheel(step){
	if (step>0) {
		fb.RunMainMenuCommand("播放/定位/后退 5 秒");
	} else {
		fb.RunMainMenuCommand("播放/定位/前进 5 秒");
	}
}

function on_playback_new_track(info){
	window.Repaint();
}

function on_playback_stop(){
	window.Repaint();
}

function on_playback_seek(time){
	window.Repaint();
}

function on_playback_time(time){
	window.Repaint();
}

function on_colors_changed() {
    window.Repaint();   
}

function on_mouse_leave() {
	window.Repaint();
}
