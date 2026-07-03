import { describe, expect, test } from 'bun:test';
import { choisirRetourDeclamation, estNavigateurIOS } from '../../src/features/jukebox/declamation';

describe('estNavigateurIOS', () => {
  test('reconnait un iPhone classique', () => {
    expect(
      estNavigateurIOS({
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
        platform: 'iPhone',
        maxTouchPoints: 5,
      }),
    ).toBe(true);
  });

  test('reconnait un iPadOS qui se presente comme Mac', () => {
    expect(
      estNavigateurIOS({
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
        platform: 'MacIntel',
        maxTouchPoints: 5,
      }),
    ).toBe(true);
  });

  test('ignore un navigateur desktop classique', () => {
    expect(
      estNavigateurIOS({
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        platform: 'MacIntel',
        maxTouchPoints: 0,
      }),
    ).toBe(false);
  });
});

describe('choisirRetourDeclamation', () => {
  test('coupe le tchin simultane sur iPhone quand la voix part', () => {
    expect(choisirRetourDeclamation({ parle: true, ios: true })).toEqual({
      jouerTchin: false,
      dureeMs: 2800,
    });
  });

  test('garde le tchin si la voix est indisponible', () => {
    expect(choisirRetourDeclamation({ parle: false, ios: true })).toEqual({
      jouerTchin: true,
      dureeMs: 1600,
    });
  });

  test('garde le tchin hors iOS', () => {
    expect(choisirRetourDeclamation({ parle: true, ios: false })).toEqual({
      jouerTchin: true,
      dureeMs: 2800,
    });
  });
});
