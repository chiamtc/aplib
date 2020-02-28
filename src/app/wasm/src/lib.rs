use std::f64;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[wasm_bindgen]
pub fn draw_spec(spectrogram_canvas_id:&str, spectrogram_canvas_height:f64, js_objects: &js_sys::Set) {
    let document = web_sys::window().unwrap().document().unwrap();
    let canvas = document.get_element_by_id(spectrogram_canvas_id).unwrap();
    let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

    let context = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>() //this is how you use JsCast dyn_into casting
        .unwrap();

    for (i, val_i) in js_sys::try_iter(js_objects).unwrap().unwrap().enumerate() {
        let z = val_i.unwrap();
        let y = js_sys::try_iter(&z).unwrap().unwrap();
        for (j, val_j) in y.enumerate() {
            context.begin_path();
            context.set_fill_style(&JsValue::from(val_j.unwrap().as_string()));
            context.fill_rect(i as f64, spectrogram_canvas_height - j as f64, 1.0, 1.0);
            context.fill();
        }
    }
}
