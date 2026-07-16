/*
    Amber — the hero mesh shader.

    Draws a slowly folding mesh of color into a canvas laid over the hero's
    still image — deep embers on the left, persimmon and magenta through the
    middle, gold and violet trading places on the right. The colors travel on
    their own; moving the pointer drags a curl through the field and pools
    warm light under the cursor, which lingers a moment and then settles.

    A progressive enhancement, like everything else here: the still image stays
    in the markup underneath, so a visitor without JavaScript or WebGL — or one
    who asked for reduced motion — sees the page exactly as designed. The canvas
    only fades in after the first frame has actually rendered.
*/

const shaderReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', function () {
    heroMeshShader();
});

window.heroMeshShader = function () {
    const host = document.querySelector('[data-hero-shader]');

    // The still image underneath is the fallback — no image, no shader.
    if (!host || !host.querySelector('img') || shaderReducedMotion.matches) {
        return;
    }

    /*
        The mesh is six color sources orbiting through the frame, blended by
        distance. A noise current bends the whole canvas first, so the blend
        folds like fabric instead of reading as circles gliding past each
        other, and a glossy fold of light sweeps through for the silk sheen.

        The pointer trail is sixteen fading force points. Each one shears the
        sampling domain sideways (the curl) and pushes it outward (the plume),
        so the cursor stirs the colors rather than just lighting them up.
    */
    const fragmentSource = `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif

        uniform vec2 u_res;
        uniform float u_time;
        uniform vec3 u_trail[16];

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(
                mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
                u.y
            );
        }

        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            // Rotating between octaves hides the underlying grid axes.
            mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);

            for (int i = 0; i < 5; i++) {
                value += amplitude * noise(p);
                p = rotate * p * 2.02;
                amplitude *= 0.5;
            }

            return value;
        }

        // Inverse-square falloff for one mesh source — squared once more so
        // each color holds its own region before melting into the next.
        float weigh(vec2 m, vec2 source) {
            vec2 d = m - source;
            float w = 1.0 / (dot(d, d) + 0.03);

            return w * w;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_res;
            float aspect = u_res.x / u_res.y;
            vec2 p = vec2(uv.x * aspect, uv.y);

            // The pointer trail: a sideways shear plus a gentle outward push,
            // each fading with distance and age.
            vec2 warp = vec2(0.0);
            float glow = 0.0;

            for (int i = 0; i < 16; i++) {
                vec3 point = u_trail[i];
                vec2 d = p - point.xy;
                float falloff = exp(-dot(d, d) * 16.0) * point.z;
                vec2 dir = d / (length(d) + 0.001);

                warp += (vec2(-dir.y, dir.x) * 0.6 + dir * 0.25) * falloff;
                glow += falloff;
            }

            p += warp * 0.45;

            float t = u_time;

            // A slow current bends the whole canvas, so even a still cursor
            // watches the colors fold and travel on their own.
            vec2 drift = vec2(
                fbm(p * 1.1 + vec2(0.0, t * 0.11)),
                fbm(p * 1.1 - vec2(t * 0.09, 3.7))
            );
            vec2 m = p + (drift - 0.5) * 1.15;

            // The six sources, each on its own slow orbit.
            vec3 color = vec3(0.0);
            float total = 0.0;
            float w = 0.0;

            // Deep mulberry, upper left — keeps one moody anchor in the frame.
            w = weigh(m, vec2(aspect * 0.10 + 0.10 * sin(t * 0.19), 0.82 + 0.10 * cos(t * 0.23)));
            color += vec3(0.17, 0.06, 0.14) * w;
            total += w;

            // Plum, lower left.
            w = weigh(m, vec2(aspect * 0.24 + 0.13 * cos(t * 0.16), 0.24 + 0.12 * sin(t * 0.21)));
            color += vec3(0.36, 0.14, 0.42) * w;
            total += w;

            // Magenta, center.
            w = weigh(m, vec2(aspect * 0.50 + 0.15 * sin(t * 0.13 + 2.1), 0.62 + 0.13 * cos(t * 0.17 + 1.3)));
            color += vec3(0.83, 0.24, 0.47) * w;
            total += w;

            // Persimmon — the brand accent — lower center.
            w = weigh(m, vec2(aspect * 0.68 + 0.14 * cos(t * 0.22 + 4.2), 0.22 + 0.12 * sin(t * 0.15 + 3.0)));
            color += vec3(0.88, 0.36, 0.22) * w;
            total += w;

            // Gold, upper right.
            w = weigh(m, vec2(aspect * 0.90 + 0.12 * sin(t * 0.18 + 1.0), 0.72 + 0.12 * cos(t * 0.14 + 5.2)));
            color += vec3(1.0, 0.70, 0.30) * w;
            total += w;

            // Violet, mid right.
            w = weigh(m, vec2(aspect * 0.82 + 0.16 * cos(t * 0.12 + 2.6), 0.38 + 0.14 * sin(t * 0.19 + 0.7)));
            color += vec3(0.47, 0.30, 0.78) * w;
            total += w;

            color /= total;

            // Silky shading and a glossy fold, so the mesh reads as fabric
            // catching light rather than flat circles of color.
            float fold = fbm(m * 1.9 + vec2(t * 0.12, -t * 0.08));
            color *= 0.62 + 0.75 * fold;

            float sheen = smoothstep(0.55, 1.0, sin((m.x - m.y * 1.6) * 2.2 + fold * 2.5 + t * 0.30));
            color += vec3(1.0, 0.82, 0.58) * sheen * sheen * 0.10;

            // Warm light pooled under the cursor.
            color += vec3(1.0, 0.62, 0.30) * glow * 0.25;

            // A whisper of grain, so the gradients never band.
            color += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.03;

            gl_FragColor = vec4(pow(color, vec3(0.9091)), 1.0);
        }
    `;

    const vertexSource = `
        attribute vec2 a_pos;

        void main() {
            gl_Position = vec4(a_pos, 0.0, 1.0);
        }
    `;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');

    const gl = canvas.getContext('webgl', { alpha: false, depth: false, stencil: false, antialias: false });

    if (!gl) {
        return;
    }

    function compile(type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    }

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertex || !fragment) {
        return;
    }

    const program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return;
    }

    gl.useProgram(program);

    // One triangle big enough to cover the viewport — cheaper than a quad.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
        res: gl.getUniformLocation(program, 'u_res'),
        time: gl.getUniformLocation(program, 'u_time'),
        trail: gl.getUniformLocation(program, 'u_trail'),
    };

    // Above the still image, below the dot grid.
    host.querySelector('img').after(canvas);

    /*
        The trail: sixteen (x, y, strength) points in the shader's coordinate
        space. Slot 0 is the resting glow that follows the cursor; the rest is
        a ring buffer of curls stamped along the pointer's path as it moves.
    */
    const TRAIL = 16;
    const SPACING = 0.05;
    const trail = new Float32Array(TRAIL * 3);
    let ring = 1;
    let cursor = null;
    let lastStamp = null;
    let hover = 0;

    function pointerPosition(event) {
        const rect = host.getBoundingClientRect();

        return {
            x: ((event.clientX - rect.left) / rect.width) * (rect.width / rect.height),
            y: 1 - (event.clientY - rect.top) / rect.height,
        };
    }

    host.addEventListener('pointermove', function (event) {
        cursor = pointerPosition(event);
        hover = 1;

        if (!lastStamp) {
            lastStamp = cursor;
            return;
        }

        // Fast flicks jump whole regions in one event, so curls are stamped
        // at even intervals along the segment, not just at its end.
        let dx = cursor.x - lastStamp.x;
        let dy = cursor.y - lastStamp.y;
        let distance = Math.hypot(dx, dy);

        while (distance > SPACING) {
            const step = SPACING / distance;

            lastStamp = {
                x: lastStamp.x + dx * step,
                y: lastStamp.y + dy * step,
            };

            trail[ring * 3] = lastStamp.x;
            trail[ring * 3 + 1] = lastStamp.y;
            trail[ring * 3 + 2] = Math.min(1, 0.35 + distance * 4);
            ring = (ring % (TRAIL - 1)) + 1;

            dx = cursor.x - lastStamp.x;
            dy = cursor.y - lastStamp.y;
            distance = Math.hypot(dx, dy);
        }
    });

    host.addEventListener('pointerleave', function () {
        hover = 0;
        lastStamp = null;
    });

    function resize() {
        // The mesh is all low frequencies — it can render below CSS
        // resolution and still look continuous, which keeps the cost down.
        const scale = Math.min(Math.max((window.devicePixelRatio || 1) * 0.55, 0.8), 1.2);
        const rect = host.getBoundingClientRect();

        canvas.width = Math.max(1, Math.round(rect.width * scale));
        canvas.height = Math.max(1, Math.round(rect.height * scale));

        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    new ResizeObserver(resize).observe(host);

    let raf = null;
    let previous = 0;
    let time = 0;
    let started = false;

    function frame(now) {
        raf = requestAnimationFrame(frame);

        // The clock is accumulated, not read, so pausing off-screen never
        // makes the colors jump forward. Long gaps clamp to one small step.
        const dt = Math.min((now - previous) / 1000 || 0, 0.1);
        previous = now;
        time += dt;

        // Curls fade over about a second; the cursor glow eases in and out.
        const decay = Math.exp(-dt * 2.8);

        for (let i = 1; i < TRAIL; i++) {
            trail[i * 3 + 2] *= decay;
        }

        const ease = 1 - Math.exp(-dt * 10);

        if (cursor) {
            trail[0] += (cursor.x - trail[0]) * ease;
            trail[1] += (cursor.y - trail[1]) * ease;
        }

        trail[2] += (hover * 0.4 - trail[2]) * ease;

        gl.uniform2f(uniforms.res, canvas.width, canvas.height);
        gl.uniform1f(uniforms.time, time);
        gl.uniform3fv(uniforms.trail, trail);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if (!started) {
            started = true;
            canvas.classList.add('is-running');
        }
    }

    function start() {
        if (raf === null) {
            previous = performance.now();
            raf = requestAnimationFrame(frame);
        }
    }

    function stop() {
        if (raf !== null) {
            cancelAnimationFrame(raf);
            raf = null;
        }
    }

    // No point drawing colors nobody can see — the loop parks while the hero
    // is scrolled away and picks its clock back up on return.
    new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
    }).observe(host);

    // If the GPU takes the context away, hand back to the still image.
    canvas.addEventListener('webglcontextlost', function (event) {
        event.preventDefault();
        stop();
        canvas.classList.remove('is-running');
    });

    // A visitor who turns motion off mid-session gets the still image back.
    shaderReducedMotion.addEventListener('change', function (event) {
        if (event.matches) {
            stop();
            canvas.classList.remove('is-running');
        }
    });
};
