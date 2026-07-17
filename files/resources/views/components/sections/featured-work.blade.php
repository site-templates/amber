@props([
    'items',
    'badge' => 'Selected work',
    'heading' => 'Six launches, six',
    'headingAccent' => 'new',
    'headingEnd' => 'beginnings.',
    'linkText' => 'View all work',
    'linkUrl' => '/work',
])
{{--
    Loops over collections/projects.json, showing the first 4 (see the break below).
    The full grid lives on pages/work.blade.php.
--}}
<section class="py-20 sm:py-28">
    <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p class="bg-ink/5 text-ink/70 inline-flex rounded-full px-3 py-1 text-sm sm:text-xs">{{ $badge }}</p>
                <h2 class="font-display mt-6 max-w-[24ch] text-5xl tracking-tight text-balance sm:text-6xl">
                    {{ $heading }} <span class="text-ink/35">{{ $headingAccent }}</span> {{ $headingEnd }}
                </h2>
            </div>
            <a href="{{ $linkUrl }}" class="hover-line text-ink/60 hover:text-ink text-base sm:text-sm">{{ $linkText }} &rarr;</a>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2" data-reveal-group>
            @foreach ($items as $project)
                <a href="{{ $project->link }}" class="group min-w-0">
                    {{-- Each client gets its own hue from one family of covers --}}
                    <div class="relative flex aspect-4/3 items-end overflow-hidden rounded-[min(2vw,24px)] p-6 sm:p-7 outline-1 -outline-offset-1 outline-black/5">
                        <img src="{{ $project->image }}" alt="{{ $project->alt }}" class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                        <span class="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/50 to-transparent" aria-hidden="true"></span>
                        <h3 class="font-display relative text-4xl text-white sm:text-5xl">{{ $project->title }}</h3>
                    </div>
                    <div class="mt-4 flex items-baseline justify-between gap-4">
                        <p class="min-w-0 truncate text-base font-medium sm:text-sm">{{ $project->service }}</p>
                        <p class="text-ink/40 shrink-0 text-base tabular-nums sm:text-sm">{{ $project->year }}</p>
                    </div>
                    <p class="text-ink/50 mt-1.5 text-base/7 text-pretty sm:text-sm/6">{{ $project->description }}</p>
                </a>
                @break($loop->iteration == 4)
            @endforeach
        </div>
    </div>
</section>
