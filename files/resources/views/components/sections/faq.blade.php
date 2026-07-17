@props([
    'items',
    'badge' => 'FAQ',
    'heading' => 'Your questions,',
    'headingAccent' => 'answered',
    'intro' => 'Still wondering something? Book a call and we\'ll talk it through.',
])
{{-- Loops over collections/faq.json — a plain <details> per row, so it needs no JavaScript. --}}
<section id="faq" class="bg-surface border-ink/5 border-y py-20 sm:py-28">
    <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-col items-center text-center">
            <p class="bg-ink/5 text-ink/70 inline-flex rounded-full px-3 py-1 text-sm sm:text-xs">{{ $badge }}</p>
            <h2 class="font-display mt-6 max-w-[24ch] text-5xl tracking-tight text-balance sm:text-6xl">
                {{ $heading }} <span class="text-ink/35">{{ $headingAccent }}</span>.
            </h2>
            <p class="text-ink/60 mt-6 max-w-[48ch] text-base/7 text-pretty">
                {{ $intro }}
            </p>
        </div>

        <div class="mx-auto mt-14 flex max-w-3xl flex-col gap-3" data-reveal-group>
            @foreach ($items as $item)
                <details class="faq-row bg-ink/5 has-[summary:hover]:bg-ink/10 rounded-2xl px-6">
                    <summary class="flex items-center justify-between gap-6 py-5">
                        <h3 class="text-base sm:text-sm">{{ $item->question }}</h3>
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" class="faq-icon stroke-ink/40 size-6 shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                        </svg>
                    </summary>
                    <p class="text-ink/60 max-w-[72ch] pb-6 text-base/7 text-pretty">{{ $item->answer }}</p>
                </details>
            @endforeach
        </div>
    </div>
</section>
