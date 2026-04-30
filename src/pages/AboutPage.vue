<script setup>
const skills = [
  { title: 'Art Direction', desc: 'Crafting the visual language and mood for every shoot.' },
  { title: 'Post-Production', desc: 'Expert retouching and color grading for a cinematic look.' },
  { title: 'Candid Portraits', desc: 'Capturing genuine emotions without forced poses.' },
  { title: 'Event Coverage', desc: 'Seamlessly documenting high-end events with discretion.' },
]
</script>

<template>
  <div class="pt-32 px-6 pb-24 min-h-screen">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div
        v-motion
        :initial="{ opacity: 0, x: -30 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 800 } }"
        class="space-y-8"
      >
        <div class="space-y-4">
          <p class="small-caps">The Person Behind The Lens</p>
          <h1 class="text-5xl md:text-8xl">Who I <span class="italic">Am</span></h1>
        </div>

        <div class="space-y-6 text-neutral-300 text-lg leading-relaxed font-light">
          <p>
            i'm a photographer based in Burundi. I'm a self-taught photographer and I'm passionate about photography. i like to see beautiful visuals and i like to capture them.        </p>
          <p>
            My journey began with a little question, "a girl can really be a photographer? how can she be a photograph reader in the events?" so i decided to start my journey as a photographer and i'm so glad i did.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-8 pt-8">
          <div class="space-y-2">
            <h3 class="text-4xl font-serif">3+</h3>
            <p class="small-caps">Years Experience</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-4xl font-serif">20+</h3>
            <p class="small-caps">Happy Clients</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-4xl font-serif">1</h3>
            <p class="small-caps">Countries Visited</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-4xl font-serif">5</h3>
            <p class="small-caps">Exhibitions</p>
          </div>
        </div>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 1000 } }"
        class="relative aspect-[4/5]"
      >
        <div class="absolute -inset-4 border border-white/5 rounded-2xl -z-10 translate-x-8 translate-y-8"></div>
        <img
          src="/uploads/owner.jpeg"
          alt="Photographer Portrait"
          class="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
          referrerpolicy="no-referrer"
        />
      </div>
    </div>

    <section class="max-w-7xl mx-auto py-24 mt-24 border-t border-white/5">
      <div class="flex flex-col md:flex-row justify-between gap-12">
        <div class="md:w-1/3">
          <h2 class="text-3xl font-serif italic">Core Expertise</h2>
        </div>
        <div class="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div v-for="(skill, i) in skills" :key="i" class="space-y-4">
            <h4 class="text-xl font-medium">{{ skill.title }}</h4>
            <p class="text-neutral-400 font-light">{{ skill.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
