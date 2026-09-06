sed -i '/<img/i\
            <div className="flex flex-col items-center justify-center w-full">' src/components/BrandIntroCinematic.tsx
sed -i '/\/>/a\
              <div className="mt-2 md:mt-4 font-body text-[#8e8e98] text-xs sm:text-sm md:text-base tracking-[0.3em] sm:tracking-[0.5em] font-bold uppercase text-center">\
                WHEN ENGINE SPEAKS\
              </div>\
            </div>' src/components/BrandIntroCinematic.tsx
