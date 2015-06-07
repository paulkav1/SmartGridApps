package rest

class FciController {

    def fciService

    def index(){
        def map = fciService.fetchDashboard()
        [summary: map]
    }
}
