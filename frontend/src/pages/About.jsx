import React from 'react'
import { assets } from '../assets/assets'
import { Award, Compass, RefreshCcw } from 'lucide-react'

const About = () => {
  return (
    <div className='pb-20 space-y-20 animate-fade-in'>
      {/* Immersive Header Banner */}
      <section className='text-center max-w-2xl mx-auto space-y-4 py-8'>
        <span className='text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase'>Our Heritage</span>
        <h1 className='text-4xl md:text-5xl font-light tracking-tight text-neutral-950'>About Our Studio</h1>
        <p className='text-neutral-500 font-light leading-relaxed text-sm md:text-base'>
          Crafting fine fashion essentials and premium home lifestyle accents for the modern connoisseur since 2018.
        </p>
      </section>

      {/* Narrative grid with Image */}
      <section className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center'>
        <div className='relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm group'>
          <img src={assets.about_img} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' alt="Our studio workspace" />
          <div className='absolute inset-0 bg-neutral-900/10 mix-blend-multiply'></div>
        </div>

        <div className='space-y-6'>
          <span className='text-xs font-semibold tracking-widest text-neutral-400 uppercase'>Craftsmanship & Quality</span>
          <h2 className='text-2xl md:text-3xl font-light text-neutral-950 leading-tight'>Artisanal detail meets contemporary design</h2>
          <p className='text-neutral-500 font-light text-sm md:text-base leading-relaxed'>
            We believe that every clothing item and home curation tells a story. That is why we work exclusively with certified carbon-neutral mills and premium organic fabrics.
          </p>
          <p className='text-neutral-500 font-light text-sm md:text-base leading-relaxed'>
            Every line, stitch, and selection is scrutinized under high-grade quality parameters to ensure you receive pieces designed to stand the test of time.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4'>
            <div className='space-y-2'>
              <div className='w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-800 shadow-sm'>
                <Award className='w-5 h-5' />
              </div>
              <h4 className='text-sm font-semibold text-neutral-950'>Premium Selection</h4>
              <p className='text-neutral-400 text-xs font-light leading-normal'>Hand-picked fabrics and high-grade materials.</p>
            </div>
            <div className='space-y-2'>
              <div className='w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-800 shadow-sm'>
                <RefreshCcw className='w-5 h-5' />
              </div>
              <h4 className='text-sm font-semibold text-neutral-950'>Circular Design</h4>
              <p className='text-neutral-400 text-xs font-light leading-normal'>Crafted with longevity and recycling in mind.</p>
            </div>
            <div className='space-y-2'>
              <div className='w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-800 shadow-sm'>
                <Compass className='w-5 h-5' />
              </div>
              <h4 className='text-sm font-semibold text-neutral-950'>Global Vision</h4>
              <p className='text-neutral-400 text-xs font-light leading-normal'>Curated globally, delivered standard to you.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
