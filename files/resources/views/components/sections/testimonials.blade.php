@props([
    'items',
    'badge' => 'Client notes',
    'heading' => 'The part we can\'t',
    'headingAccent' => 'design',
    'note' => 'Sixty-one projects shipped since 2013',
])
{{-- The featured quote already ran above, so skip it here with the inverted condition. --}}
<section class="border-ink/5 bg-surface border-y py-20 sm:py-28">
    <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p class="bg-ink/5 text-ink/70 inline-flex rounded-full px-3 py-1 text-sm sm:text-xs">{{ $badge }}</p>
                <h2 class="font-display mt-6 max-w-[24ch] text-5xl tracking-tight text-balance sm:text-6xl">
                    {{ $heading }} <span class="text-ink/35">{{ $headingAccent }}</span>.
                </h2>
            </div>
            <p class="text-ink/40 text-base sm:text-sm">{{ $note }}</p>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
            @foreach ($items as $testimonial)
                @if ($testimonial->featured != true)
                    <figure class="border-ink/10 flex flex-col justify-between gap-8 rounded-3xl border p-7">
                        <blockquote class="text-ink/70 relative text-base/7 text-pretty before:absolute before:inline before:-translate-x-full before:content-['\201C'] after:inline after:content-['\201D']">{{ $testimonial->quote }}</blockquote>
                        <figcaption class="flex items-center gap-3">
                            <img src="{{ $testimonial->avatar }}" alt="" class="size-9 shrink-0 rounded-full object-cover outline-1 -outline-offset-1 outline-black/5">
                            <div class="min-w-0 text-base sm:text-sm">
                                <p class="truncate">{{ $testimonial->name }}</p>
                                <p class="text-ink/40 truncate">{{ $testimonial->role }}</p>
                            </div>
                        </figcaption>
                    </figure>
                @endif
            @endforeach
        </div>
    </div>
</section>
