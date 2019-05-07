// created by Mattias
// https://www.shadertoy.com/view/Ms23DR
// ported to babylon.js by Evan Hemsley
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

uniform sampler2D textureSampler;
uniform vec2 screenSize;
varying vec2 vUV;

uniform float time;

vec2 curve(vec2 uv)
{
  uv = (uv - 0.5) * 2.0;
  uv *= 1.1;
  uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0);
  uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0);
  uv = (uv / 2.0) + 0.5;
  uv = uv * 0.92 + 0.04;
  return uv;
}

void main() {
  vec2 uv = curve(vUV);
  vec3 original_color = texture2D(textureSampler, vUV).xyz;
  vec3 color;
  float x = sin(0.3 * time + uv.y * 21.0) * sin(0.7 * time + uv.y * 29.0) * sin(0.3+0.33*time + uv.y*31.0)*0.0017;

  color.r = texture2D(textureSampler, vec2(x+uv.x+0.001, uv.y+0.001)).x + 0.05;
  color.g = texture2D(textureSampler, vec2(x+uv.x,uv.y-0.002)).y + 0.05;
  color.b = texture2D(textureSampler, vec2(x+uv.x-0.002,uv.y)).z + 0.05;
  color.r += 0.08*texture2D(textureSampler, 0.5*vec2(x+0.025,-0.027)+vec2(uv.x+0.001,uv.y+0.001)).x;
  color.g += 0.05*texture2D(textureSampler, 0.5*vec2(x-0.022,-0.02)+vec2(uv.x,uv.y-0.002)).y;
  color.b += 0.08*texture2D(textureSampler, 0.55*vec2(x-0.02, -0.018)+vec2(uv.x-0.002, uv.y)).z;

  color = clamp(color*0.6+0.4*color*color*1.0, 0.0, 1.0);
  float vignette = (16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y));
  color *= vec3(pow(vignette, 0.3));

  color *= vec3(0.95, 1.05, 0.95);
  color *= 2.8;

/*
  float scans = clamp(0.35 + 0.35 * sin(3.5 * time + uv.y * screenSize.y * 1.5), 0.0, 1.0);
  float s = pow(scans, 1.7);
  color = color * vec3(0.1 + 0.35 * s);
*/

  color *= 1.0+0.01*sin(110.0*time);
  if (uv.x < 0.0 || uv.x > 1.0)
    color *= 0.0;
  if (uv.y < 0.0 || uv.y > 1.0)
    color *= 0.0;

  color *= 1.0 - 0.65 * vec3(clamp((mod(gl_FragCoord.x, 2.0) - 1.0) * 2.0, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
