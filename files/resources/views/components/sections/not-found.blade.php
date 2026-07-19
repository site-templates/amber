@props([
    'badge' => '404',
    'heading' => 'This page missed the brief',
    'body' => 'Whatever lived at this address has been moved, renamed, or never made it past the first sketch. The studio, the work, and the news are all where you left them.',
    'primaryText' => 'Back to the homepage',
    'primaryLink' => '/',
    'secondaryText' => 'See the work',
    'secondaryLink' => '/work',
])
{{--
    The not-found message — shown when a visitor reaches an address that
    doesn't exist. Same centered rhythm as the hero, minus the showpiece.
--}}
<section class="pt-24 pb-24 sm:pt-32 sm:pb-36">
    <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-col items-center text-center">
            <p class="bg-ink/5 text-ink/70 inline-flex rounded-full px-3 py-1 text-sm sm:text-xs" data-reveal>{{ $badge }}</p>

            <h1 class="font-display mt-6 max-w-[20ch] text-5xl tracking-tight text-balance [--reveal-delay:50ms] sm:text-6xl" data-reveal>
                {{ $heading }}
            </h1>

            <p class="text-ink/60 mt-6 max-w-[48ch] text-lg/8 text-pretty [--reveal-delay:100ms]" data-reveal>
                {{ $body }}
            </p>

            <div class="mt-8 flex flex-wrap items-center justify-center gap-3 [--reveal-delay:150ms]" data-reveal>
                <a href="{{ $primaryLink }}" class="bg-ink text-canvas hover:bg-accent focus-visible:outline-accent rounded-full px-4 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform active:scale-[0.98] sm:text-sm">{{ $primaryText }}</a>
                <a href="{{ $secondaryLink }}" class="bg-ink/5 text-ink hover:bg-ink/10 focus-visible:outline-accent inline-flex items-center gap-1.5 rounded-full py-3 pr-3 pl-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform active:scale-[0.98] sm:text-sm">
                    {{ $secondaryText }}
                    <svg viewBox="0 0 16 16" class="fill-current size-4 h-lh shrink-0">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</section>
