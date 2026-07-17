@props(['title' => '', 'description' => '', 'category' => '', 'date' => '', 'readTime' => '', 'image' => '', 'imageAlt' => ''])
{{--
    The shared chrome for a news post: back link, meta, title, lead image, then your words.
    Write the body as plain HTML in the slot — resources/css/site.css styles it via .prose
--}}
<x-layouts.main :title="$title" :description="$description">

    <article class="pt-10 pb-20 sm:pt-16 sm:pb-28">
        <div class="mx-auto max-w-3xl px-6">

            {{-- Back on the left, date on the right — the two pills frame the title --}}
            <div class="flex items-center justify-between gap-4">
                <a href="/news" class="group bg-ink/5 text-ink/70 hover:bg-ink/10 focus-visible:outline-accent inline-flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2">
                    <svg viewBox="0 0 16 16" class="fill-current size-4 h-lh shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z"/>
                    </svg>
                    Back
                </a>
                <p class="bg-ink/5 text-ink/70 rounded-full px-3.5 py-1.5 text-sm tabular-nums">{{ $date }}</p>
            </div>

            <div class="mt-10 sm:mt-14" data-reveal>
                <p class="text-accent text-sm">{{ $category }}<span class="text-ink/20 mx-2">/</span><span class="text-ink/40">{{ $readTime }}</span></p>
                <h1 class="font-display mt-4 max-w-[24ch] text-5xl tracking-tight text-pretty sm:text-7xl">{{ $title }}</h1>
                <p class="text-ink/50 mt-6 max-w-[52ch] text-lg/8 text-pretty">{{ $description }}</p>
            </div>

            <img src="{{ $image }}" alt="{{ $imageAlt }}" class="mt-12 aspect-16/9 w-full rounded-[min(2vw,24px)] object-cover outline-1 -outline-offset-1 outline-black/5 sm:mt-16" data-reveal>

            <div class="prose mx-auto mt-14 max-w-[68ch] sm:mt-20" data-reveal>
                {{ $slot }}
            </div>

            {{-- Closing CTA, kept light so the footer's CTA stays the loud one --}}
            <div class="border-ink/10 mx-auto mt-16 max-w-[68ch] border-t pt-8">
                <p class="text-ink/50 text-base/7 text-pretty">
                    Amber is a four-person design studio for founders. If any of this sounds
                    like your launch, <a href="mailto:studio@amber.example" class="hover-line text-ink">book an intro call</a>.
                </p>
            </div>

        </div>
    </article>

</x-layouts.main>
