import unittest

from app import Handler


class ContainerContractTests(unittest.TestCase):
    def test_service_health_path_is_declared(self):
        self.assertTrue(callable(Handler.do_GET))


if __name__ == "__main__":
    unittest.main()
