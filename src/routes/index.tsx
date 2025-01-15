import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { JSXOutput } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  LuBookmark,
  LuCrown,
  LuGraduationCap,
  LuHeart,
  LuHexagon,
  LuLayoutGrid,
  LuShare,
  LuUser,
  LuVolume2,
} from "@qwikest/icons/lucide";
import { generate } from "random-words";

const ButtonContainer = component$((props: { child: JSXOutput }) => {
  return (
    <button
      popovertarget="myPopover"
      class="bg-white font-light w-10 h-10 aspect-square rounded-full shadowed flex items-center justify-center active:scale-90 transition-transform"
    >
      {props.child}
    </button>
  );
});

interface dictionary {
  word: string;
}
const DictionaryPart = component$(({ word }: dictionary) => {
  const url = useSignal(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
  );
  const responseJson = useSignal({
    phonetic: word,
    partOfSpeech: "(n.)",
    meaning: " A miniature tree grown in a pot.",
    example: "loading",
  });

  useTask$(async ({ track }) => {
    track(() => url.value);
    const res = await fetch(url.value);
    const json = await res.json();
    responseJson.value = {
      phonetic: json[0].phonetic,
      partOfSpeech: `(${json[0].meanings[0].partOfSpeech}.) `,
      meaning: ` ${json[0].meanings[0].definitions[0].definition}`,
      example: json[0].meanings[0].definitions[0].example,
    };
  });

  return (
    <div class="h-full w-full grid place-items-center snap-start">
      <div class="grid text-center translate-y-12 place-items-center">
        <span class="sm:text-7xl text-3xl md:font-normal font-bold font-serif mb-1">
          {word}
        </span>
        <span class="font-light mb-4">
          {responseJson.value.phonetic || "n/a"}
        </span>
        <span class="mb-4 w-[28ch] md:w-[48ch]">
          <span class="text-black/40">{responseJson.value.partOfSpeech}</span>
          {responseJson.value.meaning}
        </span>
        <span class="text-sm text-black/60 mb-32 w-[28ch] md:w-[48ch]">
          {responseJson.value.example || "n/a"}
        </span>

        <div class="flex gap-6 text-3xl font-thin items-center justify-center">
          <LuShare />
          <LuVolume2 />
          <LuHeart />
          <LuBookmark />
        </div>
      </div>
    </div>
  );
});

const PopOver = component$(() => {
  return (
    <div
      class="md:w-[35dvw] w-[80dvw] aspect-square shadoweder rounded-2xl grid place-items-center"
      id="myPopover"
      popover={"auto"}
    >
      Still working on it
    </div>
  );
});

export default component$(() => {
  const words: string[] = generate(5) as string[];
  return (
    <>
      <div class="relative overflow-y-scroll h-[100dvh] w-[100dvw] bg-[#F5F5F5] snap-mandatory snap-y no-scrollbar">
        <div class="fixed z-10 top-0 left-0 w-full flex items-center justify-between p-6">
          <ButtonContainer child={<LuHexagon />} />

          <div class="bg-white p-2 rounded-full flex items-center justify-center gap-2 text-xs">
            <LuBookmark />
            <span>3/5</span>
            <div class="w-28 h-2 rounded-full bg-gray-500/40 overflow-hidden">
              <div class="bg-black h-full w-[60%] rounded-full"></div>
            </div>
          </div>

          <ButtonContainer child={<LuCrown />} />
        </div>

        {words.map((word) => (
          <DictionaryPart key={word} word={word} />
        ))}

        <div class="fixed z-10 bottom-0 left-0 w-full flex items-center justify-between p-6">
          <ButtonContainer child={<LuLayoutGrid />} />

          <div class="shadowed bg-white flex gap-2 px-3 py-2 rounded-full items-center justify-center text-base">
            <LuGraduationCap class="-scale-x-100" />
            <span>Practice</span>
          </div>

          <ButtonContainer child={<LuUser />} />
        </div>
        <PopOver />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
