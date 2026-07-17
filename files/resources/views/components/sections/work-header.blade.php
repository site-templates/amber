@props([
    'badge' => 'Selected work',
    'heading' => 'Six projects, six launches.',
    'body' => 'A sample of recent engagements. Each one shipped on schedule and is still earning its keep — ask us about the numbers on our first call.',
])
<section class="pt-16 pb-12 sm:pt-24">
    <div class="mx-auto max-w-6xl px-6">
        <p class="bg-ink/5 text-ink/70 inline-flex rounded-full px-3 py-1 text-sm sm:text-xs">{{ $badge }}</p>
        <h1 class="font-display mt-6 max-w-[20ch] text-6xl tracking-tight text-balance [--reveal-delay:50ms] sm:text-7xl" data-reveal>
            {{ $heading }}
        </h1>
        <p class="text-ink/60 mt-8 max-w-[56ch] text-base/7 text-pretty [--reveal-delay:100ms]" data-reveal>
            {{ $body }}
        </p>
    </div>
</section>
