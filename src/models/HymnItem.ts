import LanguageDetect from "languagedetect";
import _ from "lodash";
import AwesomeGod from "../seedData/lyrics/AwesomeGod";
import OurGodIsGreater from "../seedData/lyrics/OurGodIsGreater";
import { LanguageCodes } from "./LanguageCodes";
import { MusicKeys } from "./MusicKeys";

export interface LyricsItem {
  key: MusicKeys;
  text: string;
}

export default class HymnItem {

  public hymnId: string;
  public title: string;
  public lyrics: Array<{ key: MusicKeys, text: string }>;
  public musicBy: string;
  public lyricsBy: string;
  public hymnCoverImage: string;
  public language: LanguageCodes;
  public submittedBy: string | null;

  constructor(
    hymnId: string,
    title: string,
    lyrics: LyricsItem[],
    lyricsBy: string,
    musicBy: string,
    language: LanguageCodes | null,
    hymnCoverImage?: string,
    submittedBy?: string,
  ) {
    this.hymnId = hymnId;
    this.title = title;
    this.lyrics = lyrics;
    this.musicBy = musicBy;
    this.lyricsBy = lyricsBy;
    this.language = language || HymnItem.detectLangCodeFromLyrics(lyrics);
    this.hymnCoverImage = hymnCoverImage || "";
    this.submittedBy = submittedBy || null;
  }

  public static formatLyricsForPreview(lyrics: LyricsItem[]): string {
    let text: string = "error"; // TODO check if error
    lyrics.forEach((item: LyricsItem) => {
      if (item.key === MusicKeys.NONE) {
        text = item.text;
      } else {
        text = lyrics[0].text;
      }
    });

    return text.replace(/(?:\r\n|\r|\n|\s\s+)/g, " ");
  }

  public static assignHymnIdForOffline = (allSavedHymns: HymnItem[]): Promise<string> => new Promise((resolve) => {
    setTimeout(() => {
      let hymnId = 0;
      while (_.isObject(_.find(allSavedHymns, {hymnId: hymnId.toString()}))) {
        hymnId++;
      }
      resolve(hymnId.toString());
    });
  })

  public static getDummyHymns(): HymnItem[] {
    const dummyHymns = [];

    dummyHymns.push(new HymnItem(
      "0",
      "Awesome God",
      AwesomeGod,
      "Rich Mullins",
      "Rich Mullins",
      null,
    ));

    dummyHymns.push(new HymnItem(
      "1",
      "Our God is Greater",
      OurGodIsGreater,
      "Chris Tomlin",
      "Chris Tomlin",
      null,
      "https://gaillardcenter.org/wp-content/uploads/Tomlin-Featured-Image.png",
    ));

    return dummyHymns;
  }

  private static detectLangCodeFromLyrics(lyrics: LyricsItem[]): LanguageCodes {
    if (!lyrics.length) {
      return LanguageCodes.ENGLISH;
    }

    const lngDetector = new LanguageDetect();
    const langs: Array<[string, number]> = lngDetector.detect(lyrics[0].text);
    if (langs && langs.length) {
      const languageName: string = langs[0][0].toUpperCase(); // e.g. ENGLISH
      // @ts-ignore
      return LanguageCodes[languageName];
    } else {
      return LanguageCodes.ENGLISH;
    }
  }
}
