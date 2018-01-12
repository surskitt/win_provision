var _Buttons_ = {};
var Buttons = {};

var g_tooltip = window.CreateTooltip();
var btn = null;
var _btn_ = null;

function Button(x, y, w, h, img_src, func, tiptext) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.func = func || function(){};
	this.tiptext = tiptext || "";
	this.img_normal = img_src && img_src.normal ? gdi.Image(img_src.normal) : null;
	this.img_hover = img_src && img_src.hover ? gdi.Image(img_src.hover) : this.img_normal;
	this.img_pressed = img_src && img_src.pressed ? gdi.Image(img_src.pressed) : this.img_normal;
	this.img = this.img_normal;

	this.trace = function(x, y) {
		return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
	}

	this.draw = function (gr) {
		this.img && gr.DrawImage(this.img, this.x, this.y, this.w, this.h, 0, 0, this.img.Width, this.img.Height);
	}

	this.click = function () {
		this.func() && this.func(x, y);
	}

	this.update = function(u) {
		switch(u) {
			case 0:
				this.img = this.img_normal;
				g_tooltip.Text = '';
				g_tooltip.Deactivate();
				break;
			case 1:
				this.img = this.img_hover;
				g_tooltip.Text = this.tiptext;
				g_tooltip.Activate();
				break;
			case 2:
				this.img = this.img_pressed;
				g_tooltip.Text = this.tiptext;
				g_tooltip.Activate();
				break;
		}
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}
}

function buttonsDraw(gr) {
	for (i in Buttons) {
		Buttons[i].draw(gr);
	}
}

function buttonsRemove(index) {
	if (typeof Buttons[index] != "undefined") {
		delete Buttons[index];
	}
}

function buttonsMove(x, y) {
	tmp_btn = null;
	for (i in Buttons) {
		if (Buttons[i].trace(x, y)) tmp_btn = i;
	}
	if (btn == tmp_btn) return;
	if (tmp_btn) Buttons[tmp_btn].update(1);
	if (btn && Buttons[btn]) Buttons[btn].update(0);
	btn = tmp_btn;

	_tmp_btn_ = null;
	for (i in _Buttons_) {
		if (_Buttons_[i].trace(x, y)) _tmp_btn_ = i;
	}
	if (_btn_ == _tmp_btn_) return;
	if (_tmp_btn_) _Buttons_[_tmp_btn_].update(1);
	if (_btn_) _Buttons_[_btn_].update(0);
	_btn_ = _tmp_btn_;
}

function buttonsUp(x, y) {
	if (btn) Buttons[btn].click(x, y);
	if (btn) Buttons[btn].update(1);
	if (_btn_) _Buttons_[_btn_].update(1);
}

function buttonsDown(x, y) {
	if (btn) Buttons[btn].update(2);
	if (_btn_) _Buttons_[_btn_].update(2);
}

function buttonsLeave() {
	for (i in Buttons) {
		Buttons[i].update(0);
	}
	btn = null;
	for (i in _Buttons_) {
		_Buttons_[i].update(0);
	}
	_btn_ = null;
}