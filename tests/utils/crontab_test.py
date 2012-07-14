from testify import TestCase, run, assert_equal, assert_raises, setup

from tron.utils import crontab


class ConvertPredefinedTestCase(TestCase):

    def test_convert_predefined_valid(self):
        expected = crontab.PREDEFINED_SCHEDULE['@hourly']
        assert_equal(crontab.convert_predefined('@hourly'), expected)

    def test_convert_predefined_invalid(self):
        assert_raises(ValueError, crontab.convert_predefined, '@bogus')

    def test_convert_predefined_none(self):
        line = 'something else'
        assert_equal(crontab.convert_predefined(line), line)


class ParseCrontabTestCase(TestCase):
    pass
#    def test_parse_asterisk(self):
#        line = '* * * * *'
#        actual = crontab.parse_crontab(line)
#        assert_equal(actual['minutes'], range(60))
#        assert_equal(actual['hours'], range(24))
#        assert_equal(actual['months'], range(1,13))


class MinuteFieldParserTestCase(TestCase):
    @setup
    def setup_parser(self):
        self.parser = crontab.MinuteFieldParser()

    def test_validate_bounds(self):
        assert_equal(self.parser.validate_bounds(0), 0)
        assert_equal(self.parser.validate_bounds(59), 59)
        assert_raises(ValueError, self.parser.validate_bounds, 60)

    def test_get_values_asterisk(self):
        assert_equal(self.parser.get_values("*"), range(0, 60))

    def test_get_values_min_only(self):
        assert_equal(self.parser.get_values("4"), [4])
        assert_equal(self.parser.get_values("33"), [33])

    def test_get_values_with_step(self):
        assert_equal(self.parser.get_values("*/10"), [0,10,20,30,40,50])

    def test_get_values_with_step_and_range(self):
        assert_equal(self.parser.get_values("10-30/10"), [10,20,30])

    def test_get_values_with_step_and_overflow_range(self):
        assert_equal(self.parser.get_values("30-0/10"), [30,40,50,0])

    def test_parse_with_groups(self):
        assert_equal(self.parser.parse("5,1,7,8,5"), [1,5,7,8])

    def test_parse_with_groups_and_ranges(self):
        expected = [0,1,11,13,15,17,19,20,21,40]
        assert_equal(self.parser.parse("1,11-22/2,*/20"), expected)


if __name__ == "__main__":
    run()