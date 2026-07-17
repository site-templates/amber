@props([
    'items',
    'badge' => 'The team',
    'heading' => 'You\'re in',
    'headingAccent' => 'experienced',
    'headingEnd' => 'hands.',
    'intro' => 'No layers of management. You work directly with the four specialists who understand your business and build the thing from start to finish.',
])
{{-- Loops over collections/team.json. --}}
<section class="bg-surface border-ink/5 border-y py-20 sm:py-28">
    <div class="mx-auto max-w-6xl px-6">
        <div class="grid gap-6 lg:grid-cols-12">
            <div class="lg:col-span-7">
                <p class="bg-ink/5 text-ink/70 inline-flex rounded-full px-3 py-1 text-sm sm:text-xs">{{ $badge }}</p>
                <h2 class="font-display mt-6 max-w-[24ch] text-5xl tracking-tight text-balance sm:text-6xl">
                    {{ $heading }} <span class="text-ink/35">{{ $headingAccent }}</span> {{ $headingEnd }}
                </h2>
            </div>
            <div class="lg:col-span-5 lg:pt-16">
                <p class="text-ink/60 max-w-[56ch] text-base/7 text-pretty">
                    {{ $intro }}
                </p>
            </div>
        </div>

        <ul role="list" class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @foreach ($items as $member)
                <li>
                    <div class="relative flex aspect-4/5 items-end overflow-hidden rounded-[min(2vw,24px)] p-5 outline-1 -outline-offset-1 outline-black/5">
                        <img src="{{ $member->image }}" alt="" class="absolute inset-0 size-full object-cover" loading="lazy">
                        <span class="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" aria-hidden="true"></span>
                        <div class="relative min-w-0">
                            <p class="truncate text-base text-white sm:text-sm">{{ $member->name }}</p>
                            <p class="truncate text-base text-white/60 sm:text-sm">{{ $member->role }}</p>
                        </div>
                    </div>
                    <p class="text-ink/50 mt-4 text-base/7 text-pretty sm:text-sm/6">{{ $member->note }}</p>
                </li>
            @endforeach
        </ul>
    </div>
</section>
