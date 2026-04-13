"""All 10 Macedonian Store Scrapers"""

from .neptun import NeptunScraper
from .setec import SetecScraper
from .tehnomarket import TehnomarketScraper
from .anhoch import AnhochScraper
from .tinex import TinexScraper
from .ramstore import RamstoreScraper
from .vero import VeroScraper
from .kam import KamScraper
from .ananas import AnanasScraper
from .zirafa import ZirafaScraper

SCRAPER_MAP = {
    'neptun': NeptunScraper,
    'setec': SetecScraper,
    'tehnomarket': TehnomarketScraper,
    'anhoch': AnhochScraper,
    'tinex': TinexScraper,
    'ramstore': RamstoreScraper,
    'vero': VeroScraper,
    'kam': KamScraper,
    'ananas': AnanasScraper,
    'zirafa': ZirafaScraper,
}

__all__ = [
    'NeptunScraper', 'SetecScraper', 'TehnomarketScraper', 'AnhochScraper',
    'TinexScraper', 'RamstoreScraper', 'VeroScraper', 'KamScraper',
    'AnanasScraper', 'ZirafaScraper', 'SCRAPER_MAP'
]
